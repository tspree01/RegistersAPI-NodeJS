import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { CartFieldName } from "../constants/fieldNames/cartFieldNames";
import { CartAttributes, CartEntity, CartInstance } from "../entities/cartEntity";

export let queryById = (id: string, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<CartAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<CartAttributes>>{ id: id }
	});
};

export let queryByLookupCode = (lookupCode: string, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<CartAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<CartAttributes>>{ lookupCode: lookupCode }
	});
};

export let queryAll = (): Bluebird<CartInstance[]> => {
	return CartEntity.findAll(<Sequelize.FindOptions<CartAttributes>>{
		order: [ [CartFieldName.CreatedOn, "ASC"] ]
	});
};

export let create = (newProduct: CartAttributes, createTransaction?: Sequelize.Transaction): Bluebird<CartInstance> => {
	return CartEntity.create(
		newProduct,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

export let destroy = (productListEntry: CartInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {
	return productListEntry.destroy(
		<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
};