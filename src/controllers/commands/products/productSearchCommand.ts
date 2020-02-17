import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Product } from "../../typeDefinitions";
import * as ProductRepository from "../models/entities/productModel";
import { ProductModel } from "../models/entities/productModel";

const validation = (validationQuery: string): CommandResponse<Product> => {
	const validationResponse: CommandResponse<Product> =
		<CommandResponse<Product>>{ status: 200 };

	if ((validationQuery == null) || (validationQuery.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026B;
	}
	return validationResponse;
};

export const search = async (query: string): Promise<CommandResponse<Product[]>> => {
	const validationResponse = validation(query);
	if (validationResponse.status !== 200)	{
		return Promise.reject(validationResponse);
	}

	return ProductRepository.searchAll(query)
		.then((existingProducts: ProductModel[]): Promise<CommandResponse<Product[]>> => {
			return Promise.resolve(<CommandResponse<Product[]>>{
				status: 200,
				data: existingProducts.map<Product>((existingProduct: ProductModel) => {
					return <Product>{
						id: existingProduct.id,
						count: existingProduct.count,
						lookupCode: existingProduct.lookupCode,
						price: existingProduct.price
					};
				})
			});
		});
};