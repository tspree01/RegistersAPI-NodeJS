// Request object definitions
export interface ProductSaveRequest {
	id?: string;
	count: number;
	lookupCode: string;
}
export interface EmployeeSaveRequest {
    id: number;
    firstName: string;
    lastName: string;
    employeeId: number;
    active: boolean;
    role: string;
    manager: number;
	password: string;
	createdOn: string;
}
// End request object definitions

// Response object definitions
// Response data object definitions
export interface Product {
	id: string;
	count: number;
	createdOn: string;
	lookupCode: string;
}
export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    employeeId: number;
    active: boolean;
    role: string;
    manager: number;
	password: string;
	createdOn: string;
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
