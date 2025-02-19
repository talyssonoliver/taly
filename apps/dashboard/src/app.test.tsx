import { render, screen } from "@testing-library/react";
import App from "./app";
import "@testing-library/jest-dom";

test("renders main application logic", () => {
  render(<App />);
  const linkElement = screen.getByText(/expected text/i);
  expect(linkElement).toBeInTheDocument();
});
