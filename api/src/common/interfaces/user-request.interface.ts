import { Request } from "express";

export interface UserPayload {
	sub: string;
	email: string;
	role: string;
	[key: string]: any; 
}

export interface UserRequest extends Request {
	user: UserPayload;
}
