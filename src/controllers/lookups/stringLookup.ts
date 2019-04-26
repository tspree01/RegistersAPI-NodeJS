export enum ParameterLookup {
	ProductId = "productId",
	ProductLookupCode = "productLookupCode",
	EmployeeId = "employeeId",
	Id = "id",
	CartId = "cartId"
}

export enum RouteLookup {
	// API routing
	API = "/api",
	Test = "/test",

	// Product
	Product = "/product",
	ByLookupCode = "/bylookupcode",

	// Employee
	Employee = "/employee",

	// Cart
	Cart = "/cart",

	// Parameters
	ProductIdParameter = "/:productId",
	ProductLookupCodeParameter = "/:productLookupCode",
	EmployeeIdParameter = "/:employeeId",
	CartIdParameter = "/:cartId",
	// End parameters
	// End product
	// End API routing
}

// Error codes
export enum ErrorCodeLookup {
	// Database
	// Database - product
	EC1001 = "Product was not found.",
	EC1001B = "Cart was not found.",
	EC1002 = "Unable to save product.",
	EC1002B = "Unable to save cart.",
	EC1003 = "Unable to delete product.",
	EC1003B = "Unable to delete cart.",
	// End database - product

	// Database - employee
	EC1004 = "Employee was not found.",
	EC1005 = "Unable to save employee.",
	EC1006 = "Unable to delete employee.",
	// End database - employee
	// End database

	// General
	// General - product
	EC2001 = "Unable to retrieve product listing.",
	EC2001B = "Unable to retrieve cart listing.",
	EC2002 = "Unable to retrieve product details",
	EC2025 = "The provided product record ID is not valid.",
	EC2026 = "Please provide a valid product lookup code.",
	EC2027 = "Please provide a valid product count.",
	EC2027B = "Please provide a valid product quantity_sold.",
	EC2028 = "Product count may not be negative.",
	EC2029 = "Conflict on parameter: lookupcode.",
	EC2028B = "Product price cannot be negative",
	// End general - product

	// General - employee
	EC2003 = "Unable to retrieve employee listing.",
	EC2004 = "Unable to retrieve employee details",
	EC2030 = "The provided employee record ID is not valid.",
	EC2031 = "Please provide a valid employee ID.",
	EC2032 = "Please provide a valid active state.",
	EC2033 = "Employee ID may not be negative.",
	EC2034 = "Please provide a valid manager.",
	EC2035 = "Manager cannot be negative.",
	EC2036 = "The provided first name is not valid.",
	EC2037 = "The provided last name is not valid.",
	EC2038 = "The provided password is not valid",
	EC2039 = "Conflict of parameter: ID"
	// End genenral - employee
	// End general
}
// End error codes
