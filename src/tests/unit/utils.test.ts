import { getCallableErrorMessage } from "../../utils/getCallableErrorMessage";
import { debounce } from "../../utils/debounce";

describe("getCallableErrorMessage", () => {
  it("returns the friendly message for insufficient coins", () => {
    const error = new Error("insufficient coin balance");

    expect(getCallableErrorMessage(error)).toBe(
      "You do not have enough coins to request this skill."
    );
  });

  it("returns the original error message for known Firebase-style errors", () => {
    const error = new Error("permission denied");

    expect(getCallableErrorMessage(error)).toBe("permission denied");
  });

  it("returns the fallback when no useful message exists", () => {
    expect(getCallableErrorMessage("boom")).toBe("Something went wrong. Please try again");
  });
});

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("waits until the delay has passed before invoking the callback", () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 250);

    debounced("first");
    debounced("second");

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(249);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });
});
