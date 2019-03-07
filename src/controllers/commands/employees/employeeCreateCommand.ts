import Bluebird from "bluebird";
import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import * as EmployeeRepository from "../models/repositories/employeeRepository";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";
import { EmployeeInstance, EmployeeAttributes } from "../models/entities/employeeEntity";

const validateSaveRequest = (saveEmployeeRequest: EmployeeSaveRequest): CommandResponse<Employee> => {
	const validationResponse: CommandResponse<Employee> =
		<CommandResponse<Employee>>{ status: 200 };
	console.log("record ID: " + saveEmployeeRequest.id);
	console.log("first_name: " + saveEmployeeRequest.firstName);
	console.log("last_name: " + saveEmployeeRequest.lastName);
	console.log("employee ID: " + saveEmployeeRequest.employee_id);
	console.log("role: " + saveEmployeeRequest.role);
	console.log("manager: " + saveEmployeeRequest.manager);
	console.log("created_ON: " + saveEmployeeRequest.createdOn);


/*	if ((saveEmployeeRequest.id == null)) {
		validationResponse.status = 421;
		validationResponse.message = ErrorCodeLookup.EC2031;
	} else if (saveEmployeeRequest.id < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2033;
	} else if (saveEmployeeRequest.firstName == null || (saveEmployeeRequest.employee_id.trim() === "")) {
		validationResponse.status = 423;
		validationResponse.message = ErrorCodeLookup.EC2035;
	} else if (saveEmployeeRequest.lastName == null) {
		validationResponse.status = 424;
		validationResponse.message = ErrorCodeLookup.EC2036;
	}*/  if ((saveEmployeeRequest.employee_id == null) || (saveEmployeeRequest.employee_id.trim() === "")) {
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
	console.log("validation Response = " + validationResponse.status);
	if (validationResponse.status !== 200) {
		return Bluebird.reject(validationResponse);
	}

	const employeeToCreate: EmployeeAttributes = <EmployeeAttributes>{
		id: saveEmployeeRequest.id,
		firstName: saveEmployeeRequest.firstName,
		lastName: saveEmployeeRequest.lastName,
		employeeId: saveEmployeeRequest.employee_id,
		active: saveEmployeeRequest.active,
		role: saveEmployeeRequest.role,
		manager: saveEmployeeRequest.manager,
		// password: saveEmployeeRequest.password,
		// createdOn: saveEmployeeRequest.createdOn
	};

	let createEmployee: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((createdTransaction: Sequelize.Transaction): Bluebird<EmployeeInstance | null> => {
			createEmployee = createdTransaction;

			return EmployeeRepository.queryById(
				saveEmployeeRequest.id,
				createEmployee);
		}).then((existingEmployee: (EmployeeInstance | null)): Bluebird<EmployeeInstance> => {
			console.log("existingEmployee = " + existingEmployee == null);
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
					id: createdEmployee.id,
					firstName: createdEmployee.firstName,
					lastName: createdEmployee.lastName,
					employee_id: createdEmployee.employeeId,
					active: createdEmployee.active,
					role: createdEmployee.role,
					manager: createdEmployee.manager,
					// password: createdEmployee.password,
					createdOn: Helper.formatDate(createdEmployee.createdOn)
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Employee>> => {
			console.log("createEmployee = " + createEmployee != null);
			if (createEmployee != null) {
				createEmployee.rollback();
			}

			return Bluebird.reject(<CommandResponse<Employee>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1005)
			});
		});
};
