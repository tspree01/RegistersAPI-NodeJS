import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { Params } from "../../../typeDefinitions";
import { CartFieldName } from "../constants/fieldNames/cartFieldNames";
import { CartAttributes, CartEntity, CartInstance } from "../entities/cartEntity";

const Op = Sequelize.Op;

export let queryByCartId = (cartid: string, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<CartAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<CartAttributes>>{ cartid: cartid }
	});
};

export let queryByProductIdAndCartId = (query: Params, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance | null> => {
	return CartEntity.findOne(<Sequelize.FindOptions<CartAttributes>>{
		where: <Sequelize.WhereOptions<CartAttributes>>{ 
			cartid: query.cart_id,
			id: query.product_id
		},
		transaction: queryTransaction
	});
};

export let queryAllByProductIdAndCartId = (params: Params, queryTransaction?: Sequelize.Transaction): Bluebird<CartInstance[]> => {
	console.log("product id in query: " + params.product_id);
	console.log("cart_id in query: " + params.cart_id);
	return CartEntity.findAll(<Sequelize.FindOptions<CartAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<CartAttributes>>
		{ [Op.and]: [{id: params.product_id}, {cartid: params.cart_id}] }
	});
};

export const updateByCartIdAndProductId = (params: Params, quantitySold: number, updateTransaction?: Sequelize.Transaction): Bluebird<[number, CartInstance[]]> => {
    return CartEntity.update(
        <CartAttributes>{
            quantity_sold: quantitySold
        }, <Sequelize.UpdateOptions>{
            where: <Sequelize.AnyWhereOptions>{
                id: params.product_id,
                cartid: params.cart_id
            },
            transaction: updateTransaction
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

export let destroyByProductIdAndCartId = (queriedProduct: CartInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {
	return queriedProduct.destroy(<Sequelize.InstanceDestroyOptions>{
		where: <Sequelize.WhereOptions<CartAttributes>>{ [Op.and]: [{id: queriedProduct.id}, {cartid: queriedProduct.cartid}] },
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