import * as restify from "restify";
import { RouteLookup } from "../controllers/lookups/stringLookup";
import * as CartRouteController from "../controllers/productRouteController";

function cartRoute(server: restify.Server) {
	server.get({ path: (RouteLookup.API + RouteLookup.Cart), version: "0.0.1" }, CartRouteController.queryProducts);

	server.get({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.CartIdParameter), version: "0.0.1" }, CartRouteController.queryProductById);

	server.get({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.ByLookupCode + RouteLookup.CartLookupCodeParameter), version: "0.0.1" }, CartRouteController.queryProductByLookupCode);

	server.post({ path: (RouteLookup.API + RouteLookup.Cart), version: "0.0.1" }, CartRouteController.createProduct);

	server.put({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.ProductIdParameter), version: "0.0.1" }, CartRouteController.updateProduct);

	server.del({ path: (RouteLookup.API + RouteLookup.Cart + RouteLookup.ProductIdParameter), version: "0.0.1" }, CartRouteController.deleteProduct);

	server.get({ path: (RouteLookup.API + RouteLookup.Test + RouteLookup.Cart), version: "0.0.1" }, (req: restify.Request, res: restify.Response, next: restify.Next) => {
		res.send(200, "Successful test. (Cart routing).");
		return next();
	});
}

module.exports.routes = cartRoute;
