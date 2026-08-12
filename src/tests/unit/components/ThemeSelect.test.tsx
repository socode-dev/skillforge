import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSelect from "@/components/ui/ThemeSelect";

const mockSetTheme = jest.fn();

jest.mock("../../../store/useThemeStore", () => ({
  __esModule: true,
  default: (selector: (state: unknown) => unknown) =>
    selector({ theme: "system", setTheme: mockSetTheme }),
}));


describe("ThemeSelect", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("renders with the current theme selected", () => {
    render(<ThemeSelect />);

    const select = screen.getByRole("combobox");

    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("system");
  });

  it("calls setTheme when a different option is selected", async () => {
    const user = userEvent.setup();

    render(<ThemeSelect />);

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "dark");

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
