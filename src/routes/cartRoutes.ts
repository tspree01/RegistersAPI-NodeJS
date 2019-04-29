import * as restify from "restify";
import { RouteLookup } from "../controllers/lookups/stringLookup";
import * as CartRouteController from "../controllers/cartRouteController";

function cartRoute(server: restify.Server) {
	server.get({ path: (RouteLookup.API + RouteLookup.Cart), version: "0.0.1" }, CartRouteController.queryCarts);

	server.get({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.CartIdParameter), version: "0.0.1" }, CartRouteController.queryCart);

	server.get({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.Test + RouteLookup.ProductIdParameter + RouteLookup.CartIdParameter), version: "0.0.1" }, CartRouteController.queryTest);
	
	server.post({ path: (RouteLookup.API + RouteLookup.Cart), version: "0.0.1" }, CartRouteController.createCart);

	server.put({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.CartIdParameter), version: "0.0.1" }, CartRouteController.updateCart);

	server.del({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.ByCartId + RouteLookup.CartIdParameter), version: "0.0.1" }, CartRouteController.deleteByCartId);

	server.del({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.ByProductId + RouteLookup.ProductIdParameter + RouteLookup.CartIdParameter), version: "0.0.1" }, CartRouteController.deleteByProductIdAndCartId);

	server.get({ path: (RouteLookup.API + RouteLookup.Test + RouteLookup.Cart), version: "0.0.1" }, (req: restify.Request, res: restify.Response, next: restify.Next) => {
		res.send(200, "Successful test. (Cart routing).");
		return next();
	});
}

module.exports.routes = cartRoute;
