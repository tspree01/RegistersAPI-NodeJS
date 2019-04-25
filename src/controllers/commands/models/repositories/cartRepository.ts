import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { CartFieldName } from "../constants/fieldNames/cartFieldNames";
import { CartAttributes, CartEntity, CartInstance } from "../entities/cartEntity";

export let queryByCartId = (cartid: string, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<CartAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<CartAttributes>>{ cartid: cartid }
	});
};

export let queryAll = (): Bluebird<CartInstance[]> => {
	return CartEntity.findAll(<Sequelize.FindOptions<CartAttributes>>{
		order: [ [CartFieldName.CreatedOn, "ASC"] ]
	});
};

export let create = (newCart: CartAttributes, createTransaction?: Sequelize.Transaction): Bluebird<CartInstance> => {
	return CartEntity.create(
		newCart,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

export let destroy = (cartListEntry: CartInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {
		return cartListEntry.destroy(<Sequelize.InstanceDestroyOptions>{
			where: <Sequelize.WhereOptions<CartAttributes>>{ cartid: cartListEntry.cartid },
			transaction: destroyTransaction
		});
};

export let destroyAll = (cartListEntry: CartInstance[], destroyTransaction?: Sequelize.Transaction): void => {
	for (const cartToDestroy of cartListEntry) {
		cartToDestroy.destroy(<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
	}
};