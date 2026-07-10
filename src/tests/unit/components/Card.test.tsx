import { render, screen } from "@testing-library/react";

import Card from "../../../components/ui/Card";

describe("Card", () => {
  it("renders children content", () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(<Card className="custom-card">Body</Card>);

    expect(screen.getByText(/body/i).closest("div")).toHaveClass("custom-card");
  });
});
