import Bluebird from "bluebird";
import Sequelize, { InstanceUpdateOptions } from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CartAttributes, CartInstance } from "../models/entities/cartEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as CartRepository from "../models/repositories/cartRepository";
import { CommandResponse, Cart, CartSaveRequest, Params } from "../../typeDefinitions";

const Op = Sequelize.Op;

const validateSaveRequest = (saveCartRequest: CartSaveRequest): CommandResponse<Cart> => {
	const validationResponse: CommandResponse<Cart> =
		<CommandResponse<Cart>>{ status: 200 };

	if ((saveCartRequest.id == null) || (saveCartRequest.id.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2025;
	} else if ((saveCartRequest.lookupCode == null) || (saveCartRequest.lookupCode.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026;
	} else if ((saveCartRequest.quantity_sold == null) || isNaN(saveCartRequest.quantity_sold)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2027;
	} else if (saveCartRequest.quantity_sold < 0) {
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
	const params: Params = {
		product_id: <string>saveCartRequest.id,
		cart_id: <string>saveCartRequest.cartid
	};

	let updateTransaction: Sequelize.Transaction;
	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Bluebird<CartInstance | null> => {
			updateTransaction = startedTransaction;

			const query: Params = {
				product_id: <string>saveCartRequest.id, 
				cart_id: <string>saveCartRequest.cartid 
			};
			return CartRepository.queryByProductIdAndCartId(query, updateTransaction);
		}).then((queriedCart: (CartInstance | null)): Bluebird<CartInstance> => {
			if (queriedCart == null) {
				return Bluebird.reject(<CommandResponse<Cart>>{
					status: 404,
					message: ErrorCodeLookup.EC1001B
				});
			}
			console.log("product id in query: " + params.product_id);
			console.log("cart_id in query: " + params.cart_id);
			const selector = { 
				where: { id: params.product_id, 
					cartid: params.cart_id }
			  };
			  
			return queriedCart.update({
					quantity_sold: saveCartRequest.quantity_sold
				},<Sequelize.InstanceUpdateOptions>{	selector,
					transaction: updateTransaction });
		}).then((updatedCart: CartInstance): Bluebird<CommandResponse<Cart>> => {
			updateTransaction.commit();

			return Bluebird.resolve(<CommandResponse<Cart>>{
				status: 200,
				data: <Cart>{
					id: updatedCart.id,
					quantity_sold: updatedCart.quantity_sold,
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
