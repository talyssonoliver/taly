import { toast } from "react-toastify";

export class ServerError extends Error {
  statusCode: number;

  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
    Object.setPrototypeOf(this, ServerError.prototype);

    toast.error(message);
  }
}
