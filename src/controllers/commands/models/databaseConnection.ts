import Bluebird from "bluebird";
import Sequelize from "sequelize";

const defaultMaximumPoolSize: number = 5;

export const DatabaseConnection: Sequelize.Sequelize =
	new Sequelize(
		<string>process.env.DATABASE_URL,
		<Sequelize.Options>{
			dialect:  "MySQL",
			protocol: "MySQL",
			omitNull: true,
			freezeTableName: true,
			pool: <Sequelize.PoolOptions>{
				min: 0,
				acquire: 30000,
				max: defaultMaximumPoolSize
			}
		});

export const startTransaction = (): Bluebird<Sequelize.Transaction> => {
	return DatabaseConnection.transaction();
};
