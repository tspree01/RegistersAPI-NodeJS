import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import * as EmployeeRepository from "../models/repositories/employeeRepository";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";
import { EmployeeInstance, EmployeeAttributes } from "../models/entities/employeeEntity";

const validateSaveRequest = (saveEmployeeRequest: EmployeeSaveRequest): CommandResponse<Employee> => {
	const validationResponse: CommandResponse<Employee> =
		<CommandResponse<Employee>>{ status: 200 };

/*	if ((saveEmployeeRequest.record_id == null)) {
		validationResponse.status = 421;
		validationResponse.message = ErrorCodeLookup.EC2031;
	}*/ /*else if (saveEmployeeRequest.record_id < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2033;
	} else if (saveEmployeeRequest.firstName == null || (saveEmployeeRequest.employee_id.trim() === "")) {
		validationResponse.status = 423;
		validationResponse.message = ErrorCodeLookup.EC2035;
	} else if (saveEmployeeRequest.lastName == null) {
		validationResponse.status = 424;
		validationResponse.message = ErrorCodeLookup.EC2036;
	}*/ if ((saveEmployeeRequest.employee_id == null) || (saveEmployeeRequest.employee_id.trim() === "")) {
		validationResponse.status = 425;
		validationResponse.message = ErrorCodeLookup.EC2031;
	} /*else if (saveEmployeeRequest.employee_id < 0) {
		validationResponse.status = 426;
		validationResponse.message = ErrorCodeLookup.EC2033;
	}*/ else if (saveEmployeeRequest.active == null) {
		validationResponse.status = 427;
		validationResponse.message = ErrorCodeLookup.EC2032;
	} else if ((saveEmployeeRequest.manager == null ) || (saveEmployeeRequest.manager.trim() === "")) {
		validationResponse.status = 428;
		validationResponse.message = ErrorCodeLookup.EC2034;
	}/* else if (saveEmployeeRequest.manager < 0) {
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

	const employeeToCreate: EmployeeAttributes = <EmployeeAttributes>{
		first_name: saveEmployeeRequest.first_name,
		last_name: saveEmployeeRequest.last_name,
		employee_id: saveEmployeeRequest.employee_id,
		active: saveEmployeeRequest.active,
		role: saveEmployeeRequest.role,
		manager: saveEmployeeRequest.manager
	};

	let createEmployee: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((createdTransaction: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
			createEmployee = createdTransaction;

			return EmployeeRepository.queryByEmployeeId(
				saveEmployeeRequest.employee_id,
				createEmployee);
		}).then((existingEmployee: (EmployeeInstance | null)): Bluebird<EmployeeInstance> => {
			if (existingEmployee != null) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 409,
					message: ErrorCodeLookup.EC2039
				});
			}
			return EmployeeRepository.create(employeeToCreate, createEmployee);
		}).then((createdEmployee: EmployeeInstance): Bluebird<CommandResponse<Employee>> => {
			createEmployee.commit();

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 201,
				data: <Employee>{
					first_name: createdEmployee.first_name,
					last_name: createdEmployee.last_name,
					employee_id: createdEmployee.employee_id,
					active: createdEmployee.active,
					role: createdEmployee.role,
					manager: createdEmployee.manager
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Employee>> => {
			if (createEmployee != null) {
				createEmployee.rollback();
			}

			return Bluebird.reject(<CommandResponse<Employee>>{
				status: (error.status || 507),
				message: (error.message || ErrorCodeLookup.EC1005)

			});
		});
};
