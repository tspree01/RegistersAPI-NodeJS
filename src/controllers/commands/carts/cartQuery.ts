import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Cart } from "../../typeDefinitions";
import { CartInstance } from "../models/entities/cartEntity";
import * as CartRepository from "../models/repositories/cartRepository";

const mapCartData = (queriedCart: CartInstance): Cart => {
	return <Cart>{
		id: queriedCart.id,
		count: queriedCart.count,
		lookupCode: queriedCart.lookupCode,
		createdOn: Helper.formatDate(queriedCart.createdOn),
		price: queriedCart.price,
		cartid: queriedCart.cartid
	};
};

export let queryByCartId = (cartId?: string): Bluebird<CommandResponse<Cart>> => {
	if (!cartId || (cartId.trim() === "")) {
		return Bluebird.reject(<CommandResponse<Cart>>{
			status: 422,
			message: ErrorCodeLookup.EC2025
		});
	}

	return CartRepository.queryByCartId(cartId)
		.then((existingCart: (CartInstance | null)): Bluebird<CommandResponse<Cart>> => {
			if (!existingCart) {
				return Bluebird.reject(<CommandResponse<Cart>>{
					status: 404,
					message: ErrorCodeLookup.EC1001B
				});
			}

			return Bluebird.resolve(<CommandResponse<Cart>>{
				status: 200,
				data: mapCartData(existingCart)
			});
		});
};