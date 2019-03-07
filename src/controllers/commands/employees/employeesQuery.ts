import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { EmployeeInstance } from "../models/entities/employeeEntity";
import * as EmployeeRepository from "../models/repositories/employeeRepository";

export let query = (): Bluebird<CommandResponse<Employee[]>> => {
	return EmployeeRepository.queryAll()
		.then((existingEmployees: EmployeeInstance[]): Bluebird<CommandResponse<Employee[]>> => {
			return Bluebird.resolve(<CommandResponse<Employee[]>>{
				status: 200,
				data: existingEmployees.map<Employee>((existingEmployee: EmployeeInstance) => {
					return <Employee>{
						id: existingEmployee.id,
						firstName: existingEmployee.firstName,
						lastName: existingEmployee.lastName,
						employee_id: existingEmployee.employeeId,
						active: existingEmployee.active,
						role: existingEmployee.role,
						manager: existingEmployee.manager,
						// password: existingEmployee.password,
						createdOn: Helper.formatDate(existingEmployee.createdOn)
					};
				})
			});
		});
};
