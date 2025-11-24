import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Example test to verify the setup works
describe("Example Test", () => {
  it("should render a simple component", () => {
    const TestComponent = () => <div>Hello, Test!</div>;

    render(<TestComponent />);

    expect(screen.getByText("Hello, Test!")).toBeInTheDocument();
  });
});
