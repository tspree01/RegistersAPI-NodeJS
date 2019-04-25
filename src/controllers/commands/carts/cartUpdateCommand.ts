import Bluebird from "bluebird";
import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CartInstance } from "../models/entities/cartEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as CartRepository from "../models/repositories/cartRepository";
import { CommandResponse, Cart, CartSaveRequest } from "../../typeDefinitions";

const validateSaveRequest = (saveCartRequest: CartSaveRequest): CommandResponse<Cart> => {
	const validationResponse: CommandResponse<Cart> =
		<CommandResponse<Cart>>{ status: 200 };

	if ((saveCartRequest.product_id == null) || (saveCartRequest.product_id.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2025;
	} else if ((saveCartRequest.lookupCode == null) || (saveCartRequest.lookupCode.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026;
	} else if ((saveCartRequest.quantity == null) || isNaN(saveCartRequest.quantity)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2027;
	} else if (saveCartRequest.quantity < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2028;
	}

	return validationResponse;
};

export let execute = (saveCartRequest: CartSaveRequest): Bluebird<CommandResponse<Cart>> => {
	const validationResponse: CommandResponse<Cart> = validateSaveRequest(saveCartRequest);
	if (validationResponse.status !== 200) {
		return Bluebird.reject(validationResponse);
	}

	let updateTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Bluebird<CartInstance | null> => {
			updateTransaction = startedTransaction;

			return CartRepository.queryByCartId(<string>saveCartRequest.cartid, updateTransaction);
		}).then((queriedCart: (CartInstance | null)): Bluebird<CartInstance> => {
			if (queriedCart == null) {
				return Bluebird.reject(<CommandResponse<Cart>>{
					status: 404,
					message: ErrorCodeLookup.EC1001B
				});
			}

			return queriedCart.update(
				<Object>{
					count: saveCartRequest.quantity + queriedCart.count // same thing as create
				},
				<Sequelize.InstanceUpdateOptions>{ transaction: updateTransaction });
		}).then((updatedCart: CartInstance): Bluebird<CommandResponse<Cart>> => {
			updateTransaction.commit();

			return Bluebird.resolve(<CommandResponse<Cart>>{
				status: 200,
				data: <Cart>{
					id: updatedCart.id,
					count: updatedCart.count,
					lookupCode: updatedCart.lookupCode,
					price: updatedCart.price,
					createdOn: Helper.formatDate(updatedCart.createdOn)
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Cart>> => {
			if (updateTransaction != null) {
				updateTransaction.rollback();
			}

			return Bluebird.reject(<CommandResponse<Cart>>{
				status: (error.status || 500),
				message: (error.messsage || ErrorCodeLookup.EC1002B)
			});
		});
};
