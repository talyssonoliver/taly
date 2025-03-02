import type { ZodError, ZodIssue } from "zod";
import { toast } from "react-toastify";

export class ValidationError extends Error {
  statusCode: number;
  issues: ZodIssue[];

  constructor(message = "Validation error", issues: ZodIssue[] = []) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.issues = issues;
    Object.setPrototypeOf(this, ValidationError.prototype);

    this.displayErrors();
  }

  static fromZodError(zodError: ZodError): ValidationError {
    return new ValidationError("Validation error", zodError.issues);
  }

  private displayErrors() {
    if (this.issues.length > 0) {
      for (const issue of this.issues) {
        toast.error(`${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      toast.error(this.message);
    }
  }
}
