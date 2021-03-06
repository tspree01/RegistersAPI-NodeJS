import Bluebird from "bluebird";
import * as restify from "restify";
import * as EmployeeQuery from "./commands/employees/employeeQuery";
import * as EmployeesQuery from "./commands/employees/employeesQuery";
import { ParameterLookup, ErrorCodeLookup } from "./lookups/stringLookup";
import * as EmployeeCreateCommand from "./commands/employees/employeeCreateCommand";
import * as EmployeeDeleteCommand from "./commands/employees/employeeDeleteCommand";
import * as EmployeeUpdateCommand from "./commands/employees/employeeUpdateCommand";
import { CommandResponse, Employee, EmployeeSaveRequest } from "./typeDefinitions";

export let queryEmployees = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	EmployeesQuery.query()
		.then((employeesQueryCommandResponse: CommandResponse<Employee[]>) => {
			res.send(
				employeesQueryCommandResponse.status,
				employeesQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 506),
				(error.message || ErrorCodeLookup.EC2003));

			return next();
		});
};

export let queryEmployeeByEmployeeId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	EmployeeQuery.queryByEmployeeId(req.params[ParameterLookup.EmployeeId])
		.then((employeeQueryCommandResponse: CommandResponse<Employee>) => {
			res.send(
				employeeQueryCommandResponse.status,
				employeeQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 505)
				 (error.message || ErrorCodeLookup.EC2004));
			return next();
		});
};

const saveEmployee = (
	req: restify.Request,
	res: restify.Response,
	next: restify.Next,
	performSave: (employeeSaveRequest: EmployeeSaveRequest) => Bluebird<CommandResponse<Employee>>): void => {

	performSave(req.body)
		.then((employeeSaveCommandResponse: CommandResponse<Employee>) => {
			res.send(
				employeeSaveCommandResponse.status,
				employeeSaveCommandResponse.data);

			return next();
		}, (errors: any) => {
			res.send(
				(errors.status || 504),
				(errors.message || ErrorCodeLookup.EC1005));

			return next();
		});
};

export let createEmployee = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveEmployee(req, res, next, EmployeeCreateCommand.execute);
};

export let updateEmployee = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveEmployee(req, res, next, EmployeeUpdateCommand.execute);
};

export let deleteEmployee = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	EmployeeDeleteCommand.execute(req.params[ParameterLookup.EmployeeId])
		.then((employeeDeleteCommandResponse: CommandResponse<void>) => {
			res.send(employeeDeleteCommandResponse.status);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 502),
				(error.message || ErrorCodeLookup.EC1006));

			return next();
		});
	
};
