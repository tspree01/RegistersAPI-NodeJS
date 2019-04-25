import Sequelize from "sequelize";
import { DatabaseConnection } from "../databaseConnection";
import { DatabaseTableName } from "../constants/databaseTableNames";
import { CartFieldName } from "../constants/fieldNames/cartFieldNames";

const modelName: string = "Cart";

export interface CartAttributes {
	product_id: string;
	quantity: number;
	createdOn: Date;
	lookupCode: string;
	cartid: string;
	price: number;
}

export interface CartInstance extends Sequelize.Instance<CartAttributes> {
	product_id: string;
	quantity: number;
	createdOn: Date;
	lookupCode: string;
	cartid: string;
	price: number;
}

export let CartEntity: Sequelize.Model<CartInstance, CartAttributes> =
	DatabaseConnection.define<CartInstance, CartAttributes>(
		modelName,
		<Sequelize.DefineModelAttributes<CartAttributes>>{
			product_id: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.ID,
				type: Sequelize.UUID,
				primaryKey: true,
				foreignKey: true
			},
			lookupCode: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.LookupCode,
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: ""
			},
			quantity: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.Quantity,
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			createdOn: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.CreatedOn,
				type: Sequelize.DATE,
				allowNull: true
			},
			price: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.Price,
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: 0
			},
			cartid: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.CartId,
				type: Sequelize.UUID,
				allowNull: true
			},
		},
		<Sequelize.DefineOptions<CartInstance>>{
			timestamps: false,
			freezeTableName: true,
			tableName: DatabaseTableName.CART
		});
