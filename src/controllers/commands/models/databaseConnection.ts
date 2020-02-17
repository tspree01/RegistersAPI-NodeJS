import Sequelize from "sequelize";

const defaultMaximumPoolSize: number = 5;

export const DatabaseConnection: Sequelize.Sequelize =
	new Sequelize.Sequelize(
		<string>process.env.JAWSDB_URL,
		<Sequelize.Options>{
			dialect:  "mysql",
			protocol: "mysql",
			omitNull: true,
			freezeTableName: true,
			pool: <Sequelize.PoolOptions>{
				min: 0,
				acquire: 30000,
				max: defaultMaximumPoolSize
			}
		});

export const startTransaction = (): Promise<Sequelize.Transaction> => {
	return DatabaseConnection.transaction();
};
