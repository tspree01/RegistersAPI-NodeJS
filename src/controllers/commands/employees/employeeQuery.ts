import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { EmployeeInstance } from "../models/entities/employeeEntity";
import * as EmployeeRepository from "../models/repositories/employeeRepository";

const mapEmployeeData = (queriedEmployee: EmployeeInstance): Employee => {
	return <Employee>{
		id: queriedEmployee.id,
		firstName: queriedEmployee.firstName,
		lastName: queriedEmployee.lastName,
		employee_id: queriedEmployee.employeeId,
		active: queriedEmployee.active,
		role: queriedEmployee.role,
		manager: queriedEmployee.manager,
		password: queriedEmployee.password,
		createdOn: Helper.formatDate(queriedEmployee.createdOn)
	};
};

export let queryById = (recordId?: number): Bluebird<CommandResponse<Employee>> => {
	if (!recordId) {
		return Bluebird.reject(<CommandResponse<Employee>>{
			status: 422,
			message: ErrorCodeLookup.EC2025
		});
	}

	return EmployeeRepository.queryById(recordId)
		.then((existingEmployee: (EmployeeInstance | null)): Bluebird<CommandResponse<Employee>> => {
			if (!existingEmployee) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 200,
				data: mapEmployeeData(existingEmployee)
			});
		});
};

export let queryByFirstName = (employeeFirstName?: string): Bluebird<CommandResponse<Employee>> => {
	if (!employeeFirstName || (employeeFirstName.trim() === "")) {
		return Bluebird.reject(<CommandResponse<Employee>>{
			status: 422,
			message: ErrorCodeLookup.EC2026
		});
	}

	return EmployeeRepository.queryByFirstName(employeeFirstName)
		.then((existingEmployee: (EmployeeInstance | null)): Bluebird<CommandResponse<Employee>> => {
			if (!existingEmployee) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 200,
				data: mapEmployeeData(existingEmployee)
			});
		});
};

export let queryByLastName = (queryByLastName?: string): Bluebird<CommandResponse<Employee>> => {
	if (!queryByLastName || (queryByLastName.trim() === "")) {
		return Bluebird.reject(<CommandResponse<Employee>>{
			status: 422,
			message: ErrorCodeLookup.EC2026
		});
	}

	return EmployeeRepository.queryByLastName(queryByLastName)
		.then((existingEmployee: (EmployeeInstance | null)): Bluebird<CommandResponse<Employee>> => {
			if (!existingEmployee) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 200,
				data: mapEmployeeData(existingEmployee)
			});
		});
};
