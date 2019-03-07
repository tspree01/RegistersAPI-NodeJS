import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { EmployeeInstance } from "../models/entities/employeeEntity";
import * as EmployeeRepository from "../models/repositories/employeeRepository";

const mapEmployeeData = (queriedEmployee: EmployeeInstance): Employee => {
	return <Employee>{
		// record_id: queriedEmployee.record_id,
		first_Name: queriedEmployee.first_name,
		last_Name: queriedEmployee.last_name,
		employee_id: queriedEmployee.employee_id,
		active: queriedEmployee.active,
		role: queriedEmployee.role,
		manager: queriedEmployee.manager,
		// password: queriedEmployee.password,
		// createdOn: Helper.formatDate(queriedEmployee.createdOn)
	};
};

export let queryByEmployee_Id = (employeeID?: string): Bluebird<CommandResponse<Employee>> => {
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
			message: ErrorCodeLookup.EC2026
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
