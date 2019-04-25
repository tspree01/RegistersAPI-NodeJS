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
						first_name: existingEmployee.first_name,
						last_name: existingEmployee.last_name,
						employee_id: existingEmployee.employee_id,
						active: existingEmployee.active,
						role: existingEmployee.role,
						manager: existingEmployee.manager,
						amount_of_money_made: existingEmployee.amount_of_money_made
					};
				})
			});
		});
};
