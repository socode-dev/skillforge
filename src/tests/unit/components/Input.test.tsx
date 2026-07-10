import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Input from "@/components/ui/Input";

describe("Input", () => {
  it("renders the label and placeholder", () => {
    render(
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  });

  it("updates its value when the user types", async () => {
    const user = userEvent.setup();

    render(<Input label="Name" name="name" type="text" />);

    const input = screen.getByLabelText(/name/i);

    await user.type(input, "Alex");

    expect(input).toHaveValue("Alex");
  });
});
