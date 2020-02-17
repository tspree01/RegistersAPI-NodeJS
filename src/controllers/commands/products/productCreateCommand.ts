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

	if ((saveProductRequest.lookupCode == null) || (saveProductRequest.lookupCode.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026;
	} else if ((saveProductRequest.count == null) || isNaN(saveProductRequest.count)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2027;
	} else if (saveProductRequest.count < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2028;
	} else if (saveProductRequest.price < 0) {
        validationResponse.status = 422;
        validationResponse.message = ErrorCodeLookup.EC2028B;
    }

	return validationResponse;
};

export const execute = async (saveProductRequest: ProductSaveRequest): Promise<CommandResponse<Product>> => {
	const validationResponse: CommandResponse<Product> = validateSaveRequest(saveProductRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	const productToCreate: ProductModel = <ProductModel>{
		id:saveProductRequest.id,
		count: saveProductRequest.count,
		lookupCode: saveProductRequest.lookupCode,
		price: saveProductRequest.price
	};

	let createTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction() 
		.then((createdTransaction: Sequelize.Transaction): Promise<ProductModel | null> => {
			createTransaction = createdTransaction;

			return ProductRepository.queryByLookupCode( 
				saveProductRequest.lookupCode,
				createTransaction);
		}).then((existingProduct: (ProductModel | null)): Promise<ProductModel> => {
			if (existingProduct != null) {
				return Promise.reject(<CommandResponse<Product>>{
					status: 409,
					message: ErrorCodeLookup.EC2029
				});
			}

			// return ProductRepository.create(productToCreate, createTransaction);
			return ProductModel.create(
				productToCreate,
				<Sequelize.CreateOptions>{
					transaction: createTransaction
				});
		}).then((createdProduct: ProductModel): Promise<CommandResponse<Product>> => {
			createTransaction.commit();

			return Promise.resolve(<CommandResponse<Product>>{
				status: 201,
				data: <Product>{
					id: createdProduct.id,
					count: createdProduct.count,
					lookupCode: createdProduct.lookupCode,
					createdOn: Helper.formatDate(createdProduct.createdOn),
					price: createdProduct.price
				}
			});
		}).catch((error: any): Promise<CommandResponse<Product>> => {
			if (createTransaction != null) {
				createTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<Product>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1002)
			});
		});
};
