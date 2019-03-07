import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { EmployeeFieldName } from "../constants/fieldNames/employeeFieldNames";
import { EmployeeAttributes, EmployeeEntity, EmployeeInstance } from "../entities/employeeEntity";

export let queryById = (id: number, queryEmployeeTransaction?: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
	return EmployeeEntity.findOne(<Sequelize.FindOptions<EmployeeAttributes>>{
		transaction: queryEmployeeTransaction,
		where: <Sequelize.WhereOptions<EmployeeAttributes>>{ record_id: id }
	});
};

export let queryByFirstName = (firstName: string, queryEmployeeTransaction?: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
	return EmployeeEntity.findOne(<Sequelize.FindOptions<EmployeeAttributes>>{
		transaction: queryEmployeeTransaction,
		where: <Sequelize.WhereOptions<EmployeeAttributes>>{ first_name: firstName }
	});
};

export let queryByLastName = (lastName: string, queryEmployeeTransaction?: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
	return EmployeeEntity.findOne(<Sequelize.FindOptions<EmployeeAttributes>>{
		transaction: queryEmployeeTransaction,
		where: <Sequelize.WhereOptions<EmployeeAttributes>>{ last_name: lastName }
	});
};

export let queryByEmployeeId = (employeeId: number, queryEmployeeTransaction?: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
	return EmployeeEntity.findOne(<Sequelize.FindOptions<EmployeeAttributes>>{
		transaction: queryEmployeeTransaction,
		where: <Sequelize.WhereOptions<EmployeeAttributes>>{ employee_id: employeeId }
	});
};

export let queryAll = (): Bluebird<EmployeeInstance[]> => {
	return EmployeeEntity.findAll(<Sequelize.FindOptions<EmployeeAttributes>>{
		order: [ [EmployeeFieldName.CreatedOn, "ASC"] ]
	});
};

export let create = (newEmployee: EmployeeAttributes, createEmployee?: Sequelize.Transaction): Bluebird<EmployeeInstance> => {
	return EmployeeEntity.create(
		newEmployee,
		<Sequelize.CreateOptions>{
			transaction: createEmployee
		});
};

export let destroy = (employeeListEntry: EmployeeInstance, destroyEmployee?: Sequelize.Transaction): Bluebird<void> => {
	return employeeListEntry.destroy(
		<Sequelize.InstanceDestroyOptions>{
			transaction: destroyEmployee
		});
};
