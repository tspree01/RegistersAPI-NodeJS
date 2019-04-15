import Bluebird from "bluebird";
import * as restify from "restify";
import * as CartsQuery from "./commands/carts/cartQueryAll";
import { ParameterLookup, ErrorCodeLookup } from "./lookups/stringLookup";
import * as CartCreateCommand from "./commands/carts/cartCreateCommand";
import * as CartDeleteCommand from "./commands/carts/cartDeleteCommand";
import * as CartUpdateCommand from "./commands/carts/cartUpdateCommand";
import { CommandResponse, Product, ProductSaveRequest } from "./typeDefinitions";

export let queryProducts = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	CartsQuery.query()
		.then((productsQueryCommandResponse: CommandResponse<Product[]>) => {
			res.send(
				productsQueryCommandResponse.status,
				productsQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC2001));

			return next();
		});
};

const saveCart = (
	req: restify.Request,
	res: restify.Response,
	next: restify.Next,
	performSave: (productSaveRequest: ProductSaveRequest) => Bluebird<CommandResponse<Product>>): void => {

	console.log("REQUEST BODY: " + req.body);

	performSave(req.body)
		.then((productSaveCommandResponse: CommandResponse<Product>) => {
			res.send(
				productSaveCommandResponse.status,
				productSaveCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1002));

			return next();
		});
};

export let createCart = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveCart(req, res, next, CartCreateCommand.execute);
};

export let updateCart = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveCart(req, res, next, CartUpdateCommand.execute);
};

export let deleteCart = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	CartDeleteCommand.execute(req.params[ParameterLookup.ProductId])
		.then((productDeleteCommandResponse: CommandResponse<void>) => {
			res.send(productDeleteCommandResponse.status);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1003));

			return next();
		});
};
