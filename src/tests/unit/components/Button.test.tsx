import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders its children text", () => {
    render(
      <Button type="button" variant="primary">
        Continue
      </Button>
    );

    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("calls onClick when enabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Button type="button" variant="secondary" onClick={onClick}>
        Save
      </Button>
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Button type="button" variant="outline" onClick={onClick} isDisabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: /disabled/i });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
