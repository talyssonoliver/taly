import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import Jest DOM matchers
import PaymentForm from "./PaymentForm";

test("renders payment form", () => {
  render(<PaymentForm />);
  expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});

test("submits form with valid data", () => {
  render(<PaymentForm />);
  fireEvent.change(screen.getByLabelText(/amount/i), {
    target: { value: "100" },
  });
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
});

test("shows error message with invalid data", () => {
  render(<PaymentForm />);
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "" } });
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
});
