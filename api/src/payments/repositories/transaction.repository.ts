import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

interface TransactionWhereInput {
	id?: string;
	paymentId?: string;
	userId?: string;
	type?: string;
	status?: string;
	[key: string]: string | undefined;
}

interface TransactionOrderByWithRelationInput {
	id?: "asc" | "desc";
	createdAt?: "asc" | "desc";
	amount?: "asc" | "desc";
	[key: string]: "asc" | "desc" | undefined;
}

interface TransactionUpdateInput {
	status?: string;
	amount?: number;
	type?: string;
	providerTransactionId?: string;
	providerResponse?: string;
	[key: string]: string | number | undefined;
}

// Define result interface for raw queries
interface TransactionResult {
	id: string;
	paymentId: string;
	userId: string;
	amount: number;
	type: string;
	status: string;
	providerTransactionId?: string;
	providerResponse?: string;
	createdAt: Date;
	updatedAt: Date;
	payment_id?: string;
	payment_amount?: number;
	payment_status?: string;
	provider?: string;
	user_id?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
}

@Injectable()
export class TransactionRepository {
	private readonly logger = new Logger(TransactionRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findMany(options: {
		skip?: number;
		take?: number;
		where?: TransactionWhereInput;
		orderBy?: TransactionOrderByWithRelationInput;
	}) {
		try {
			const { skip, take, where, orderBy } = options;

			// Access the model directly through the prisma client using bracket notation
			return this.prisma.$queryRaw`
				SELECT t.*, 
				       p.id as payment_id, p.amount as payment_amount, p.status as payment_status, p.provider,
				       u.id as user_id, u.email, u.firstName, u.lastName
				FROM "Transaction" t
				LEFT JOIN "Payment" p ON t.paymentId = p.id
				LEFT JOIN "User" u ON t.userId = u.id
				WHERE ${
					where
						? `${Object.keys(where)
								.map((k) => `t.${k} = '${where[k]}'`)
								.join(" AND ")}`
						: "TRUE"
				}
				ORDER BY t.createdAt DESC
				LIMIT ${take || 10} OFFSET ${skip || 0}
			`;
		} catch (error) {
			this.logger.error(
				`Error finding transactions: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async count(options: { where?: TransactionWhereInput }) {
		try {
			const { where } = options;

			// Use raw query for count
			const result = await this.prisma.$queryRaw`
				SELECT COUNT(*) as count FROM "Transaction"
				WHERE ${
					where
						? `${Object.keys(where)
								.map((k) => `${k} = '${where[k]}'`)
								.join(" AND ")}`
						: "TRUE"
				}
			`;
			return Number(result[0].count);
		} catch (error) {
			this.logger.error(
				`Error counting transactions: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findById(id: string) {
		try {
			// Use raw query to find by ID
			const result = await this.prisma.$queryRaw<TransactionResult[]>`
				SELECT t.*, 
				       p.id as payment_id, p.amount as payment_amount, p.status as payment_status, p.provider,
				       u.id as user_id, u.email, u.firstName, u.lastName
				FROM "Transaction" t
				LEFT JOIN "Payment" p ON t.paymentId = p.id
				LEFT JOIN "User" u ON t.userId = u.id
				WHERE t.id = ${id}
			`;
			return result[0] || null;
		} catch (error) {
			this.logger.error(
				`Error finding transaction by ID ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findByPaymentId(paymentId: string) {
		try {
			// Use raw query to find by payment ID
			return this.prisma.$queryRaw<TransactionResult[]>`
				SELECT t.*, 
				       u.id as user_id, u.email, u.firstName, u.lastName
				FROM "Transaction" t
				LEFT JOIN "User" u ON t.userId = u.id
				WHERE t.paymentId = ${paymentId}
				ORDER BY t.createdAt DESC
			`;
		} catch (error) {
			this.logger.error(
				`Error finding transactions by payment ID ${paymentId}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async create(data: {
		paymentId: string;
		userId: string;
		amount: number;
		type: string;
		status?: string;
		providerTransactionId?: string;
		providerResponse?: string;
	}) {
		try {
			const {
				paymentId,
				userId,
				amount,
				type,
				status = 'SUCCESS', // Default status if not provided
				providerTransactionId,
				providerResponse,
			} = data;

			// Insert the transaction
			await this.prisma.$executeRaw`
				INSERT INTO "Transaction" (
					"paymentId", "userId", "amount", "type", "status", 
					"providerTransactionId", "providerResponse", "createdAt", "updatedAt"
				)
				VALUES (
					${paymentId}, ${userId}, ${amount}, ${type}, ${status}, 
					${providerTransactionId || null}, ${providerResponse || null}, NOW(), NOW()
				)
			`;

			// Get the ID of the newly created record
			const result = await this.prisma.$queryRaw<TransactionResult[]>`
				SELECT * FROM "Transaction"
				WHERE "paymentId" = ${paymentId} AND "userId" = ${userId} AND "type" = ${type}
				ORDER BY "createdAt" DESC
				LIMIT 1
			`;

			return result.length > 0 ? result[0] : null;
		} catch (error) {
			this.logger.error(
				`Error creating transaction: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async update(id: string, data: TransactionUpdateInput) {
		try {
			// Build SET clause for update
			const setClause = Object.entries(data)
				.map(
					([key, value]) =>
						`"${key}" = ${typeof value === "string" ? `'${value}'` : value}`,
				)
				.join(", ");

			await this.prisma.$executeRaw`
				UPDATE "Transaction"
				SET ${setClause}, "updatedAt" = NOW()
				WHERE id = ${id}
			`;

			return this.findById(id);
		} catch (error) {
			this.logger.error(
				`Error updating transaction ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
}
