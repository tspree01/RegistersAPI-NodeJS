import Sequelize from "sequelize";
import { ProductFieldName } from "../constants/fieldNames/productFieldNames";
import { ProductAttributes } from "../entities/productEntity";
import { ProductModel } from "../entities/productModel";


const Op = Sequelize.Op;

export const queryById = async (id: string, queryTransaction?: Sequelize.Transaction): Promise<ProductModel | null> => {
	return ProductModel.findOne(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions>{ id: id }
	});
};

export const queryByLookupCode = async (lookupCode: string, queryTransaction?: Sequelize.Transaction): Promise<ProductModel | null> => {
	return ProductModel.findOne(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions>{ lookupCode: lookupCode }
	});
};

export const queryAll = async (): Promise<ProductModel[]> => {
	return ProductModel.findAll(<Sequelize.FindOptions>{
		order: [ [ProductFieldName.CreatedOn, "ASC"] ]
	});
};

export const searchAll = async (query: string): Promise<ProductModel[]> => {
	return ProductModel.findAll({
		where: {
			lookupCode: { [Op.like]: query + "%" }
		}
	});
};

export const create = async (newProduct: ProductAttributes, createTransaction?: Sequelize.Transaction): Promise<ProductModel> => {
	return ProductModel.create(
		newProduct,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

/*export const destroy = async (productListEntry: ProductInstance, destroyTransaction?: Sequelize.Transaction): Promise<void> => {
	return productListEntry.destroy(
		<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
};*/
