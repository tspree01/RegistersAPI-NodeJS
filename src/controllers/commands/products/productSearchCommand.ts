import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Product } from "../../typeDefinitions";
import { ProductInstance } from "../models/entities/productEntity";
import * as ProductRepository from "../models/repositories/productRepository";

const validation = (validationQuery: string): CommandResponse<Product> => {
	const validationResponse: CommandResponse<Product> =
		<CommandResponse<Product>>{ status: 200 };

	if ((validationQuery == null) || (validationQuery.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026B;
	}
	return validationResponse;
}

export let search = (query: string): Bluebird<CommandResponse<Product[]>> => {
	const validationResponse = validation(query);
	if (validationResponse.status !== 200)	{
		return Bluebird.reject(validationResponse);
	}

	return ProductRepository.searchAll(query)
		.then((existingProducts: ProductInstance[]): Bluebird<CommandResponse<Product[]>> => {
			return Bluebird.resolve(<CommandResponse<Product[]>>{
				status: 200,
				data: existingProducts.map<Product>((existingProduct: ProductInstance) => {
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