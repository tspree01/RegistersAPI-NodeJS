import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import * as ProductRepository from "../models/entities/productModel";
import { CommandResponse, Product, ProductSaveRequest } from "../../typeDefinitions";
import { ProductModel } from "../models/entities/productModel";

const validateSaveRequest = (saveProductRequest: ProductSaveRequest): CommandResponse<Product> => {
	const validationResponse: CommandResponse<Product> =
		<CommandResponse<Product>>{ status: 200 };

	if ((saveProductRequest.id == null) || (saveProductRequest.id.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2025;
	} else if ((saveProductRequest.lookupCode == null) || (saveProductRequest.lookupCode.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026;
	} else if ((saveProductRequest.count == null) || isNaN(saveProductRequest.count)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2027;
	} else if (saveProductRequest.count < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2028;
	}

	return validationResponse;
};

export const execute = async (saveProductRequest: ProductSaveRequest): Promise<CommandResponse<Product>> => {
	const validationResponse: CommandResponse<Product> = validateSaveRequest(saveProductRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	let updateTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Promise<ProductModel | null> => {
			updateTransaction = startedTransaction;

			return ProductRepository.queryById(<string>saveProductRequest.id, updateTransaction);
		}).then((queriedProduct: (ProductModel | null)): Promise<ProductModel> => {
			if (queriedProduct == null) {
				return Promise.reject(<CommandResponse<Product>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			if (saveProductRequest.quantity_sold > 0)
				return queriedProduct.update(
				<Object>{
					count: queriedProduct.count - saveProductRequest.quantity_sold,
					total_sold: queriedProduct.total_sold + saveProductRequest.quantity_sold // count here is quantity of product sold
				},
				<Sequelize.InstanceUpdateOptions>{ transaction: updateTransaction}); 
			else 
				return queriedProduct.update(
				<Object>{
					count: saveProductRequest.count,
					lookupCode: saveProductRequest.lookupCode,
					price: saveProductRequest.price
				},
				<Sequelize.InstanceUpdateOptions>{ transaction: updateTransaction });
		}).then((updatedProduct: ProductModel): Promise<CommandResponse<Product>> => {
			updateTransaction.commit();

			return Promise.resolve(<CommandResponse<Product>>{
				status: 200,
				data: <Product>{
					id: updatedProduct.id,
					count: updatedProduct.count,
					lookupCode: updatedProduct.lookupCode,
					createdOn: Helper.formatDate(updatedProduct.createdOn),
					total_sold: updatedProduct.total_sold
				}
			});
		}).catch((error: any): Promise<CommandResponse<Product>> => {
			if (updateTransaction != null) {
				updateTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<Product>>{
				status: (error.status || 500),
				message: (error.messsage || ErrorCodeLookup.EC1002)
			});
		});
};
