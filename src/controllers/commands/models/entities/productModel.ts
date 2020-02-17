import Sequelize from "sequelize";
import { DatabaseConnection } from "../databaseConnection";
import { DatabaseTableName } from "../constants/databaseTableNames";
import { ProductFieldName } from "../constants/fieldNames/productFieldNames";
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from "sequelize";


export class ProductModel extends Model {
	public count!: number;
	public lookupCode!: string;
	public price!: number;
	public total_sold!: number;
	public readonly id!: string;
	public readonly createdOn!: Date;

}

ProductModel.init(
	<ModelAttributes>{
		id: <ModelAttributeColumnOptions>{
			field: ProductFieldName.ID,
			type: DataTypes.UUID,
			autoIncrement: true,
			primaryKey: true

		},
		count: <ModelAttributeColumnOptions>{
			field: ProductFieldName.Count,
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		createdOn: <ModelAttributeColumnOptions>{
			field: ProductFieldName.CreatedOn,
			type: new DataTypes.DATE(),
			allowNull: true
		},
		lookupCode: <ModelAttributeColumnOptions>{
			field: ProductFieldName.LookupCode,
			type: new DataTypes.STRING(32),
			allowNull: false,
			defaultValue: ""
		},
		price: <ModelAttributeColumnOptions>{
			field: ProductFieldName.Price,
			type: new DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0
		},
		total_sold: <ModelAttributeColumnOptions>{
			field: ProductFieldName.Sold,
			type: new DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		}
	}, <InitOptions>{
		timestamps: false,
		freezeTableName: true,
		sequelize: DatabaseConnection,
		tableName: DatabaseTableName.PRODUCT
	});


// Database interaction
/*export const queryById = async (
	id: string,
	queryTransaction?: Sequelize.Transaction
): Promise<ProductModel | null> => {

	return ProductModel.findOne(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ id: id }
	});
};

export const queryByLookupCode = async (
	lookupCode: string,
	queryTransaction?: Sequelize.Transaction
): Promise<ProductModel | null> => {

	return ProductModel.findOne(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ lookupCode: lookupCode }
	});
};

export const queryAll = async (): Promise<ProductModel[]> => {
	return ProductModel.findAll(<Sequelize.FindOptions>{
		order: [ [ ProductFieldName.CreatedOn, "ASC" ] ]
	});
};*/
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

export const create = async (newProduct: ProductModel, createTransaction?: Sequelize.Transaction): Promise<ProductModel> => {
	return ProductModel.create(
		newProduct,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

export const destroy = async (productListEntry: ProductModel, destroyTransaction?: Sequelize.Transaction): Promise<void> => {
	return productListEntry.destroy(
		<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
};
