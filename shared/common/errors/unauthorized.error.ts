import { toast } from "react-toastify";

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);

    toast.error(message);

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }
}
