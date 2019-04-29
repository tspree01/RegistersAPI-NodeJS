import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { CommandResponse, Params } from "../../typeDefinitions";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CartInstance } from "../models/entities/cartEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as CartRepository from "../models/repositories/cartRepository";

export let execute = (params: Params): Bluebird<CommandResponse<void>> => {
	if ((params.product_id == null) || (params.product_id === "")) {
		return Bluebird.resolve(<CommandResponse<void>>{ status: 204 });
	}
	if ((params.cart_id == null) || (params.cart_id === "")) {
		return Bluebird.resolve(<CommandResponse<void>>{ status: 204 });
	}

	let deleteTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Bluebird<CartInstance | null> => {
			deleteTransaction = startedTransaction;

			return CartRepository.queryByProductIdAndCartId(params, deleteTransaction);
		}).then((queriedProduct: (CartInstance | null)): Bluebird<void> => {
			if (queriedProduct == null) {
				return Bluebird.resolve();
			}

			return CartRepository.destroyByProductIdAndCartId(queriedProduct, deleteTransaction);
		}).then((): Bluebird<CommandResponse<void>> => {
			deleteTransaction.commit();

			return Bluebird.resolve(<CommandResponse<void>>{ status: 204 });
		}).catch((error: any): Bluebird<CommandResponse<void>> => {
			if (deleteTransaction != null) {
				deleteTransaction.rollback();
			}

			return Bluebird.reject(<CommandResponse<void>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1003)
			});
		});
};
