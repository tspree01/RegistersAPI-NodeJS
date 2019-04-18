import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { ProductFieldName } from "../constants/fieldNames/productFieldNames";
import { ProductAttributes, CartEntity, ProductInstance } from "../entities/cartEntity";

export let queryById = (id: string, queryTransaction?: Sequelize.Transaction): Bluebird<ProductInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<ProductAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<ProductAttributes>>{ id: id }
	});
};

export let queryAll = (): Bluebird<ProductInstance[]> => {
	return CartEntity.findAll(<Sequelize.FindOptions<ProductAttributes>>{
		order: [ [ProductFieldName.CreatedOn, "ASC"] ]
	});
};

export let create = (newCart: ProductAttributes, createTransaction?: Sequelize.Transaction): Bluebird<ProductInstance> => {
	return CartEntity.create(
		newCart,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

export let destroy = (productListEntry: ProductInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {

		return productListEntry.destroy(<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
};

export let destroyAll = (productListEntry: ProductInstance[], destroyTransaction?: Sequelize.Transaction): void => {
	for (const productToDestroy of productListEntry) {
		productToDestroy.destroy(<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
	}
};