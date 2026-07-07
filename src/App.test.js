import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the notes app shell", () => {
  render(<App />);

  expect(screen.getByText("Notes")).toBeInTheDocument();
  expect(screen.getByText(/select a note or create a new one/i)).toBeInTheDocument();
});
