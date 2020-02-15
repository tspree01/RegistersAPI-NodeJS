import * as fs from "fs";
import dotenv from "dotenv";
import * as restify from "restify";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

export let apis = restify.createServer({
	version: "0.0.1",
	name: "register-apis"
});

apis.pre(restify.pre.sanitizePath());
apis.use(restify.plugins.acceptParser(apis.acceptable));
apis.use(restify.plugins.bodyParser());
apis.use(restify.plugins.queryParser());
apis.use(restify.plugins.authorizationParser());
apis.use(restify.plugins.fullResponse());

fs.readdirSync(__dirname + "/routes").forEach(function (routeConfig: string) {
	if (routeConfig.substr(-3) === ".js") {
		require(__dirname + "/routes/" + routeConfig)
			.routes(apis);
	}
});

export default apis;
