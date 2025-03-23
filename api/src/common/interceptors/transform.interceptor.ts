import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
	data: T;
	success: boolean;
	timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => ({
				data,
				success: true,
				timestamp: new Date().toISOString(),
			})),
		);
	}
}
