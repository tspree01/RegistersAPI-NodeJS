import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { CommandResponse, Cart } from "../../typeDefinitions";
import { CartInstance } from "../models/entities/cartEntity";
import * as CartRepository from "../models/repositories/cartRepository";

export let query = (): Bluebird<CommandResponse<Cart[]>> => {
	return CartRepository.queryAll()
		.then((existingCarts: CartInstance[]): Bluebird<CommandResponse<Cart[]>> => {
			return Bluebird.resolve(<CommandResponse<Cart[]>>{
				status: 200,
				data: existingCarts.map<Cart>((existingCart: CartInstance) => {
					return <Cart>{
						id: existingCart.id,
						count: existingCart.count,
						lookupCode: existingCart.lookupCode,
						createdOn: Helper.formatDate(existingCart.createdOn),
						price: existingCart.price,
						cartid: existingCart.cartid
					};
				})
			});
		});
};
