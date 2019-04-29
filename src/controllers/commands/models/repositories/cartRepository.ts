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

export let queryByProductId = (productid: string, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<CartAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<CartAttributes>>{ id: productid }
	});
};

export let queryAll = (): Bluebird<CartInstance[]> => {
	return CartEntity.findAll(<Sequelize.FindOptions<CartAttributes>>{
		order: [ [CartFieldName.CreatedOn, "ASC"] ]
	});
};

export let queryByAllCartId = (cartid: string): Bluebird<CartInstance[]> => {
	return CartEntity.findAll(<Sequelize.FindOptions<CartAttributes>>{
		where: <Sequelize.WhereOptions<CartAttributes>>{ cartid: cartid}
	});
};

export let create = (newCart: CartAttributes, createTransaction?: Sequelize.Transaction): Bluebird<CartInstance> => {
	return CartEntity.create(
		newCart,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

export let destroyByCartId = (queriedCart: CartInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {
		return queriedCart.destroy(<Sequelize.InstanceDestroyOptions>{
			where: <Sequelize.WhereOptions<CartAttributes>>{ cartid: queriedCart.cartid },
			transaction: destroyTransaction
		});
};

export let destroyByProductId = (queriedProduct: CartInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {
	return queriedProduct.destroy(<Sequelize.InstanceDestroyOptions>{
		where: <Sequelize.WhereOptions<CartAttributes>>{ id: queriedProduct.id },
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