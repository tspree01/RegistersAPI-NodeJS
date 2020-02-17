import Sequelize from "sequelize";
import { CommandResponse } from "../../typeDefinitions";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import * as ProductRepository from "../models/entities/productModel";
import { ProductModel } from "../models/entities/productModel";

export let execute = (productId?: string): Promise<CommandResponse<void>> => {
	if ((productId == null) || (productId.trim() === "")) {
		return Promise.resolve(<CommandResponse<void>>{ status: 204 });
	}

	let deleteTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Promise<ProductModel | null> => {
			deleteTransaction = startedTransaction;

			return ProductRepository.queryById(productId, deleteTransaction);
		}).then((queriedProduct: (ProductModel | null)): Promise<void> => {
			if (queriedProduct == null) {
				return Promise.resolve();
			}

			return ProductRepository.destroy(queriedProduct, deleteTransaction);
		}).then((): Promise<CommandResponse<void>> => {
			deleteTransaction.commit();

			return Promise.resolve(<CommandResponse<void>>{ status: 204 });
		}).catch((error: any): Promise<CommandResponse<void>> => {
			if (deleteTransaction != null) {
				deleteTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<void>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1003)
			});
		});
};
