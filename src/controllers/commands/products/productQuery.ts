import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Product } from "../../typeDefinitions";
import * as ProductRepository from "../models/entities/productModel";
import { ProductModel } from "../models/entities/productModel";

export const mapProductData = (queriedProduct: ProductModel): Product => {
	return <Product>{
		id: queriedProduct.id,
		count: queriedProduct.count,
		lookupCode: queriedProduct.lookupCode,
		createdOn: Helper.formatDate(queriedProduct.createdOn),
		price: queriedProduct.price,
		total_sold: queriedProduct.total_sold
	};
};

export const queryById = async (recordId?: string): Promise<CommandResponse<Product>> => {
	if (!recordId || (recordId.trim() === "")) {
		return Promise.reject(<CommandResponse<Product>>{
			status: 422,
			message: ErrorCodeLookup.EC2025
		});
	}

	return ProductRepository.queryById(recordId)
		.then((existingProduct: (ProductModel | null)): Promise<CommandResponse<Product>> => {
			if (!existingProduct) {
				return Promise.reject(<CommandResponse<Product>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Promise.resolve(<CommandResponse<Product>>{
				status: 200,
				data: mapProductData(existingProduct)
			});
		});
};

export const queryByLookupCode = async (productLookupCode?: string): Promise<CommandResponse<Product>> => {
	if (!productLookupCode || (productLookupCode.trim() === "")) {
		return Promise.reject(<CommandResponse<Product>>{
			status: 422,
			message: ErrorCodeLookup.EC2026
		});
	}

	return ProductRepository.queryByLookupCode(productLookupCode)
		.then((existingProduct: (ProductModel | null)): Promise<CommandResponse<Product>> => {
			if (!existingProduct) {
				return Promise.reject(<CommandResponse<Product>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Promise.resolve(<CommandResponse<Product>>{
				status: 200,
				data: mapProductData(existingProduct)
			});
		});
};
