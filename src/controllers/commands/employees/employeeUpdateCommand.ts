import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { EmployeeInstance } from "../models/entities/employeeEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as EmployeeRepository from "../models/repositories/employeeRepository";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";

const validateSaveRequest = (saveEmployeeRequest: EmployeeSaveRequest): CommandResponse<Employee> => {
	const validationResponse: CommandResponse<Employee> =
		<CommandResponse<Employee>>{ status: 200 };

/*	if ((saveEmployeeRequest.record_id == null)) {
		validationResponse.status = 421;
		validationResponse.message = ErrorCodeLookup.EC2031;
	}*/ /*else if (saveEmployeeRequest.record_id < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2033;
	} else if (saveEmployeeRequest.first_Name == null) {
		validationResponse.status = 423;
		validationResponse.message = ErrorCodeLookup.EC2035;
	} else if (saveEmployeeRequest.last_Name == null) {
		validationResponse.status = 424;
		validationResponse.message = ErrorCodeLookup.EC2036;
	}*/ if ((saveEmployeeRequest.employee_id == null) || (saveEmployeeRequest.employee_id.trim() === "")) {
		validationResponse.status = 425;
		validationResponse.message = ErrorCodeLookup.EC2031;
	} /*else if (saveEmployeeRequest.employee_id < 0) {
		validationResponse.status = 426;
		validationResponse.message = ErrorCodeLookup.EC2033;
	}*/ /*else if (saveEmployeeRequest.active == null) {
		validationResponse.status = 427;
		validationResponse.message = ErrorCodeLookup.EC2032;
	} else if ((saveEmployeeRequest.manager == null ) || (saveEmployeeRequest.manager.trim() === "")) {
		validationResponse.status = 428;
		validationResponse.message = ErrorCodeLookup.EC2034;
	}*//* else if (saveEmployeeRequest.manager < 0) {
		validationResponse.status = 429;
		validationResponse.message = ErrorCodeLookup.EC2035;
	} else if ((saveEmployeeRequest.password == null) || (saveEmployeeRequest.password.trim() === "")) {
		validationResponse.status = 430;
		validationResponse.message = ErrorCodeLookup.EC2038;
	}*/

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
			console.log("employee_id: " + saveEmployeeRequest.employee_id);
			console.log("amount of money: " + saveEmployeeRequest.amount_of_money_made);
			return EmployeeRepository.queryByEmployeeId(<string>saveEmployeeRequest.employee_id, updateEmployee);
		}).then((queriedEmployee: (EmployeeInstance | null)): Bluebird<EmployeeInstance> => {
			if (queriedEmployee == null) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1004
				});
			}
			console.log("employee_id: " + saveEmployeeRequest.employee_id);
			console.log("amount of money: " + saveEmployeeRequest.amount_of_money_made);
			console.log("queried money: " + queriedEmployee.amount_of_money_made);
			console.log("update id: " + updateEmployee);
			if (saveEmployeeRequest.amount_of_money_made > 0)
				return queriedEmployee.update(
				<Object>{
					amount_of_money_made: queriedEmployee.amount_of_money_made + saveEmployeeRequest.amount_of_money_made
				},
				<Sequelize.InstanceUpdateOptions>{ update: updateEmployee });
			else 
				return queriedEmployee.update(
				<Object>{
					first_name: saveEmployeeRequest.first_name,
					last_name: saveEmployeeRequest.last_name,
					employee_id: saveEmployeeRequest.employee_id,
					active: saveEmployeeRequest.active,
					role: saveEmployeeRequest.role,
					manager: saveEmployeeRequest.manager
				},
				<Sequelize.InstanceUpdateOptions>{ update: updateEmployee });
		}).then((updatedEmployee: EmployeeInstance): Bluebird<CommandResponse<Employee>> => {
			updateEmployee.commit();

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 200,
				data: <Employee>{
					first_name: updatedEmployee.first_name,
					last_name: updatedEmployee.last_name,
					employee_id: updatedEmployee.employee_id,
					active: updatedEmployee.active,
					role: updatedEmployee.role,
					manager: updatedEmployee.manager,
					amount_of_money_made: updatedEmployee.amount_of_money_made
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Employee>> => {
			if (updateEmployee != null) {
				updateEmployee.rollback();
			}

			return Bluebird.reject(<CommandResponse<Employee>>{
				status: (error.status || 510),
				message: (error.messsage || ErrorCodeLookup.EC1005)
			});
		});
};
