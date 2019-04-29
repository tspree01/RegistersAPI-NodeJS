import Bluebird from "bluebird";
import * as restify from "restify";
import * as CartsQuery from "./commands/carts/cartQueryAll";
import * as CartQueryAllByCartId from "./commands/carts/cartQueryAllByCartId";
import { ParameterLookup, ErrorCodeLookup } from "./lookups/stringLookup";
import * as CartCreateCommand from "./commands/carts/cartCreateCommand";
import * as CartDeleteByCartIdCommand from "./commands/carts/cartDeleteByCartIdCommand";
import * as CartDeleteByProductIdCommand from "./commands/carts/cartDeleteByProductIdCommand";
import * as CartUpdateCommand from "./commands/carts/cartUpdateCommand";
import { CommandResponse, Cart, CartSaveRequest } from "./typeDefinitions";

export let queryCarts = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	return CartsQuery.query()
		.then((cartsQueryCommandResponse: CommandResponse<Cart[]>) => {
			res.send(
				cartsQueryCommandResponse.status,
				cartsQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC2001B));

			return next();
		});
};

export let queryCart = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	return CartQueryAllByCartId.queryAllByCartID(req.params[ParameterLookup.CartId])
		.then((cartsQueryCommandResponse: CommandResponse<Cart[]>) => {
			res.send(
				cartsQueryCommandResponse.status,
				cartsQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC2001B));

			return next();
		});
};

const saveCart = (
	req: restify.Request,
	res: restify.Response,
	next: restify.Next,
	performSave: (cartSaveRequest: CartSaveRequest) => Bluebird<CommandResponse<Cart>>): void => {

	console.log("REQUEST BODY: " + req.body);

	performSave(req.body)
		.then((cartSaveCommandResponse: CommandResponse<Cart>) => {
			res.send(
				cartSaveCommandResponse.status,
				cartSaveCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1002B));

			return next();
		});
};

export let createCart = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveCart(req, res, next, CartCreateCommand.execute);
};

export let updateCart = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveCart(req, res, next, CartUpdateCommand.execute);
};

export let deleteByCartId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	return CartDeleteByCartIdCommand.execute(req.params[ParameterLookup.CartId]) // may bugged
		.then((productDeleteCommandResponse: CommandResponse<void>) => {
			res.send(productDeleteCommandResponse.status);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1003B));

			return next();
		});
};

export let deleteByProductId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	return CartDeleteByProductIdCommand.execute(req.params[ParameterLookup.ProductId]) // may bugged
		.then((productDeleteCommandResponse: CommandResponse<void>) => {
			res.send(productDeleteCommandResponse.status);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1003B));

			return next();
		});
};

