import Bluebird from "bluebird";
import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { EmployeeInstance } from "../models/entities/employeeEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as EmployeeRepository from "../models/repositories/employeeRepository";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";

const validateSaveRequest = (saveEmployeeRequest: EmployeeSaveRequest): CommandResponse<Employee> => {
	const validationResponse: CommandResponse<Employee> =
		<CommandResponse<Employee>>{ status: 200 };

	if ((saveEmployeeRequest.id == null) || isNaN(saveEmployeeRequest.id)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2031;
	}

	return validationResponse;
};

export let execute = (saveEmployeeRequest: EmployeeSaveRequest): Bluebird<CommandResponse<Employee>> => {
	const validationResponse: CommandResponse<Employee> = validateSaveRequest(saveEmployeeRequest);
	if (validationResponse.status !== 200) {
		return Bluebird.reject(validationResponse);
	}

	let updateEmployee: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedUpdate: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
			updateEmployee = startedUpdate;

			return EmployeeRepository.queryById(saveEmployeeRequest.id, updateEmployee);
		}).then((queriedEmployee: (EmployeeInstance | null)): Bluebird<EmployeeInstance> => {
			if (queriedEmployee == null) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1004
				});
			}

			return queriedEmployee.update(
				<Object>{
					id: saveEmployeeRequest.id,
					firstName: saveEmployeeRequest.firstName,
					lastName: saveEmployeeRequest.lastName,
					employeeId: saveEmployeeRequest.employeeId,
					active: saveEmployeeRequest.active,
					role: saveEmployeeRequest.role,
					manager: saveEmployeeRequest.manager,
					password: saveEmployeeRequest.password
				},
				<Sequelize.InstanceUpdateOptions>{ update: updateEmployee });
		}).then((updatedEmployee: EmployeeInstance): Bluebird<CommandResponse<Employee>> => {
			updateEmployee.commit();

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 200,
				data: <Employee>{
					id: updatedEmployee.id,
					firstName: updatedEmployee.firstName,
					lastName: updatedEmployee.lastName,
					employeeId: updatedEmployee.employeeId,
					active: updatedEmployee.active,
					role: updatedEmployee.role,
					manager: updatedEmployee.manager,
					password: updatedEmployee.password,
					createdOn: Helper.formatDate(updatedEmployee.createdOn)
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Employee>> => {
			if (updateEmployee != null) {
				updateEmployee.rollback();
			}

			return Bluebird.reject(<CommandResponse<Employee>>{
				status: (error.status || 500),
				message: (error.messsage || ErrorCodeLookup.EC1005)
			});
		});
};
