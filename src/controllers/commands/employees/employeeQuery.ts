import Bluebird from "bluebird";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { EmployeeInstance } from "../models/entities/employeeEntity";
import * as EmployeeRepository from "../models/repositories/employeeRepository";

const mapEmployeeData = (queriedEmployee: EmployeeInstance): Employee => {
	return <Employee>{
		first_name: queriedEmployee.first_name,
		last_name: queriedEmployee.last_name,
		employee_id: queriedEmployee.employee_id,
		active: queriedEmployee.active,
		role: queriedEmployee.role,
		manager: queriedEmployee.manager,
		amount_of_money_made: queriedEmployee.amount_of_money_made
	};
};

export let queryByEmployeeId = (employeeID?: string): Bluebird<CommandResponse<Employee>> => {
	if (!employeeID) {
		return Bluebird.reject(<CommandResponse<Employee>>{
			status: 422,
			message: ErrorCodeLookup.EC2030
		});
	}

	return EmployeeRepository.queryByEmployeeId(employeeID)
		.then((existingEmployee: (EmployeeInstance | null)): Bluebird<CommandResponse<Employee>> => {
			if (!existingEmployee) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1004
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
			message: ErrorCodeLookup.EC2036
		});
	}

	return EmployeeRepository.queryByFirstName(employeeFirstName)
		.then((existingEmployee: (EmployeeInstance | null)): Bluebird<CommandResponse<Employee>> => {
			if (!existingEmployee) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1004
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
			message: ErrorCodeLookup.EC2037
		});
	}

	return EmployeeRepository.queryByLastName(queryByLastName)
		.then((existingEmployee: (EmployeeInstance | null)): Bluebird<CommandResponse<Employee>> => {
			if (!existingEmployee) {
				return Bluebird.reject(<CommandResponse<Employee>>{
					status: 404,
					message: ErrorCodeLookup.EC1004
				});
			}

			return Bluebird.resolve(<CommandResponse<Employee>>{
				status: 200,
				data: mapEmployeeData(existingEmployee)
			});
		});
};
