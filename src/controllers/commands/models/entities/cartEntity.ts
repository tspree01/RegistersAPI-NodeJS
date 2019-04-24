import Sequelize from "sequelize";
import { DatabaseConnection } from "../databaseConnection";
import { DatabaseTableName } from "../constants/databaseTableNames";
import { CartFieldName } from "../constants/fieldNames/cartFieldNames";

const modelName: string = "Cart";

export interface ProductAttributes {
	id: string;
	count: number;
	createdOn: Date;
	lookupCode: string;
	cartid: string;
	price: number;
}

export interface ProductInstance extends Sequelize.Instance<ProductAttributes> {
	id: string;
	count: number;
	createdOn: Date;
	lookupCode: string;
	cartid: string;
	price: number;
}

export let CartEntity: Sequelize.Model<ProductInstance, ProductAttributes> =
	DatabaseConnection.define<ProductInstance, ProductAttributes>(
		modelName,
		<Sequelize.DefineModelAttributes<ProductAttributes>>{
			id: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.ID,
				type: Sequelize.UUID,
				primaryKey: true
			},
			lookupCode: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.LookupCode,
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: ""
			},
			count: <Sequelize.DefineAttributeColumnOptions>{
				field: CartFieldName.Count,
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
				type: Sequelize.INTEGER,
				allowNull: true
			},
		},
		<Sequelize.DefineOptions<ProductInstance>>{
			timestamps: false,
			freezeTableName: true,
			tableName: DatabaseTableName.CART
		});
