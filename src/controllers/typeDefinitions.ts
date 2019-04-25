// Request object definitions
export interface ProductSaveRequest {
	id?: string;
	count: number;
	lookupCode: string;
	price: number;
	total_sold: number;
}

export interface CartSaveRequest {
	id?: string;
	count: number;
	lookupCode: string;
	price: number;
	cartid: string;
}

export interface EmployeeSaveRequest {
    first_name: string;
    last_name: string;
    employee_id: string;
    active: boolean;
    role: string;
    manager: string;
	password: string;
	amount_of_money_made: number;
}
// End request object definitions

// Response object definitions
// Response data object definitions
export interface Product {
	id: string;
	count: number;
	createdOn: string;
	lookupCode: string;
	price: number;
	total_sold: number;
}

export interface Cart {
	id: string;
	count: number;
	createdOn: string;
	lookupCode: string;
	price: number;
	cartid: string;
}

export interface Employee {
    first_name: string;
    last_name: string;
    employee_id: string;
    active: boolean;
    role: string;
    manager: string;
	password: string;
	amount_of_money_made: number;
}
// End response data object definitions

// API response data
export interface ApiResponse {
	errorMessage?: string;
}

export interface ProductSaveResponse extends ApiResponse {
	product: Product;
}
export interface EmployeeSaveResponse extends ApiResponse {
	employee: Employee;
}
// End API response data
// End response object definitions

export interface CommandResponse<T> {
	data?: T;
	status: number;
	message?: string;
}
