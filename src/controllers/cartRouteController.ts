import Bluebird from "bluebird";
import * as restify from "restify";
import * as CartsQuery from "./commands/carts/cartQueryAll";
import * as CartQueryAllByCartId from "./commands/carts/cartQueryAllByCartId";
import * as CartQueryAllByProductAndCartId from "./commands/carts/cartQueryAllByCartIdAndProductId";
import { ParameterLookup, ErrorCodeLookup } from "./lookups/stringLookup";
import * as CartCreateCommand from "./commands/carts/cartCreateCommand";
import * as CartDeleteByCartIdCommand from "./commands/carts/cartDeleteByCartIdCommand";
import * as CartDeleteByProductIdAndCartIdCommand from "./commands/carts/cartDeleteByProductIdAndCartIdCommand";
import * as CartUpdateCommand from "./commands/carts/cartUpdateCommand";
import * as CartUpdateFromProductListingCommand from "./commands/carts/cartUpdateFromProductListingCommand";
import { CommandResponse, Cart, CartSaveRequest, Params } from "./typeDefinitions";

export let queryCarts = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	CartsQuery.query()
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
	CartQueryAllByCartId.queryAllByCartID(req.params[ParameterLookup.CartId])
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

export let queryTest = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	const params: Params = {
		product_id: req.params[ParameterLookup.ProductId], 
		cart_id: req.params[ParameterLookup.CartId] 
	};
	console.log("product id going in: " + req.params[ParameterLookup.ProductId]);
	console.log("cart_id: " + req.params[ParameterLookup.CartId]);
	console.log("product id: " + params.product_id);
	console.log("cart_id: " + params.cart_id);
	CartQueryAllByProductAndCartId.queryAllByProductAndCartID(params)
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

export let updateCartByProductAndCartId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveCart(req, res, next, CartUpdateCommand.execute);
};

export let updateCartByProductAndCartIdFromProductListing = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveCart(req, res, next, CartUpdateFromProductListingCommand.execute);
};

export let deleteByCartId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	CartDeleteByCartIdCommand.execute(req.params[ParameterLookup.CartId])
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

export let deleteByProductIdAndCartId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	const params: Params = {
		product_id: req.params[ParameterLookup.ProductId], 
		cart_id: req.params[ParameterLookup.CartId] 
	};

	CartDeleteByProductIdAndCartIdCommand.execute(params)
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

