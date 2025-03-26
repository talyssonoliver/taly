export interface User {
	id: string;
	email: string;
	password?: string; 
	firstName: string;
	lastName?: string;
	role?: string;
	isActive: boolean;
	avatar?: string;
	phone?: string;
	address?: string;
	provider?: string;
	providerId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserWithoutPassword extends Omit<User, "password"> {
	fullName?: string;
}
