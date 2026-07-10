import { render, screen } from "@testing-library/react";

import Dialog from "../../../components/ui/Dialog";

describe("Dialog", () => {
  it("renders its children", () => {
    render(<Dialog>Dialog body</Dialog>);

    expect(screen.getByText(/dialog body/i)).toBeInTheDocument();
  });

  it("applies the supplied class name", () => {
    render(<Dialog className="test-dialog">Hello</Dialog>);

    expect(screen.getByText(/hello/i).closest("div")).toHaveClass("test-dialog");
  });
});
