import Bluebird from "bluebird";
import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import * as CartRepository from "../models/repositories/cartRepository";
import { CommandResponse, Cart, CartSaveRequest } from "../../typeDefinitions";
import { CartInstance, CartAttributes } from "../models/entities/cartEntity";

const validateSaveRequest = (saveCartRequest: CartSaveRequest): CommandResponse<Cart> => {
	const validationResponse: CommandResponse<Cart> =
		<CommandResponse<Cart>>{ status: 200 };

	if ((saveCartRequest.lookupCode == null) || (saveCartRequest.lookupCode.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026;
	} else if ((saveCartRequest.quantity_sold == null) || isNaN(saveCartRequest.quantity_sold)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2027;
	} else if (saveCartRequest.quantity_sold < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2028;
	} else if (saveCartRequest.price < 0) {
        validationResponse.status = 422;
        validationResponse.message = ErrorCodeLookup.EC2028B;
    }

	return validationResponse;
};

export let execute = (saveCartRequest: CartSaveRequest): Bluebird<CommandResponse<Cart>> => {
	const validationResponse: CommandResponse<Cart> = validateSaveRequest(saveCartRequest);
	if (validationResponse.status !== 200) {
		return Bluebird.reject(validationResponse);
	}

	const cartToCreate: CartAttributes = <CartAttributes>{
		id: saveCartRequest.id,
		quantity_sold: saveCartRequest.quantity_sold,
		lookupCode: saveCartRequest.lookupCode,
		price: saveCartRequest.price,
		cartid: saveCartRequest.cartid
	};

	let createTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction() 
		.then((createdTransaction: Sequelize.Transaction): Bluebird<CartInstance> => { 
			createTransaction = createdTransaction;

			return CartRepository.create(cartToCreate, createTransaction); 
		}).then((createdProduct: CartInstance): Bluebird<CommandResponse<Cart>> => { 
			createTransaction.commit();

			return Bluebird.resolve(<CommandResponse<Cart>>{
				status: 201,
				data: <Cart>{
					id: createdProduct.id,
					quantity_sold: createdProduct.quantity_sold, // this quantity_sold is the quantity of product about to be sold so use it to pass into product update
					lookupCode: createdProduct.lookupCode,
					createdOn: Helper.formatDate(createdProduct.createdOn),
					price: createdProduct.price,
					cartid: createdProduct.cartid
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Cart>> => {
			if (createTransaction != null) {
				createTransaction.rollback();
			}

			return Bluebird.reject(<CommandResponse<Cart>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1002B)
			});
		});
};
