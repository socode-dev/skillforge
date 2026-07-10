import { resetRequestsStore, toast, useRequestsStore } from "./useRequestsStore.testUtils";

describe("useRequestsStore loading state", () => {
  beforeEach(() => {
    resetRequestsStore();
  });

  it("updates nested loading state when an id is provided", () => {
    useRequestsStore.getState().setLoading("isAccepting", true, "req-1");

    expect(useRequestsStore.getState().loading.isAccepting["req-1"]).toBe(true);

    useRequestsStore.getState().setLoading("isAccepting", false, "req-1");
    expect(useRequestsStore.getState().loading.isAccepting["req-1"]).toBe(false);
  });

  it("does not change state when setLoading is called without an id", () => {
    const previousState = useRequestsStore.getState().loading;

    useRequestsStore.getState().setLoading("isAccepting", true);

    expect(useRequestsStore.getState().loading).toEqual(previousState);
  });
});
