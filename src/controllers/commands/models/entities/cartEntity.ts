import Sequelize from "sequelize";
import { DatabaseConnection } from "../databaseConnection";
import { DatabaseTableName } from "../constants/databaseTableNames";
import { CartFieldName } from "../constants/fieldNames/cartFieldNames";

const modelName: string = "Cart";

export interface CartAttributes {
	id: string;
	quantity_sold: number;
	createdOn: Date;
	lookupCode: string;
	cartid: string;
	price: number;
}

export interface CartInstance extends Sequelize.Instance<CartAttributes> {
	id: string;
	quantity_sold: number;
	createdOn: Date;
	lookupCode: string;
	cartid: string;
	price: number;
}

export let CartEntity: Sequelize.Model<CartInstance, CartAttributes> =
	DatabaseConnection.define<CartInstance, CartAttributes>(
		modelName,
		<Sequelize.DefineModelAttributes<CartAttributes>>{
			id: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.ID,
				type: Sequelize.UUID,
				primaryKey: true
			},
			lookupCode: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.LookupCode,
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: ""
			},
			quantity_sold: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.QuantitySold,
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: 0
			},
			createdOn: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.CreatedOn,
				type: Sequelize.DATE,
				allowNull: true
			},
			price: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.Price,
				type: Sequelize.DECIMAL,
				allowNull: true,
				defaultValue: 0
			},
			cartid: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.CartId,
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: true
			},
		},
		<Sequelize.DefineOptions<CartInstance>>{
			timestamps: false,
			freezeTableName: true,
			tableName: DatabaseTableName.CART
		});
