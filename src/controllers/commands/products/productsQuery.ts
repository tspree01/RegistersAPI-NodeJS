import * as Helper from "../helpers/helper";
import { CommandResponse, Product } from "../../typeDefinitions";
import * as ProductRepository from "../models/entities/productModel";
import { ProductModel } from "../models/entities/productModel";

export const query = async (): Promise<CommandResponse<Product[]>> => {
	return ProductRepository.queryAll()
		.then((existingProducts: ProductModel[]): Promise<CommandResponse<Product[]>> => {
			return Promise.resolve(<CommandResponse<Product[]>>{
				status: 200,
				data: existingProducts.map<Product>((existingProduct: ProductModel) => {
					return <Product>{
						id: existingProduct.id,
						count: existingProduct.count,
						lookupCode: existingProduct.lookupCode,
						createdOn: Helper.formatDate(existingProduct.createdOn),
						price: existingProduct.price,
						total_sold: existingProduct.total_sold
					};
				})
			});
		});
};
