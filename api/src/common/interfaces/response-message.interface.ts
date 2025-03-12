export interface ResponseMessage<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
