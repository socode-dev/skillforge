import { Clock, Send, Hourglass, CheckCircle2, RotateCcw } from "lucide-react";
import { resetRequestsStore, useRequestsStore } from "./useRequestsStore.testUtils";

describe("useRequestsStore button children", () => {
  beforeEach(() => {
    resetRequestsStore();
  });

  it("returns the correct button text and icon for each request status", () => {
    expect(useRequestsStore.getState().getSkillRequestButtonChildren()).toEqual({
      text: "Request",
      icon: Send,
    });

    expect(
      useRequestsStore.getState().getSkillRequestButtonChildren("PENDING")
    ).toEqual({
      text: "Requested",
      icon: Clock,
    });

    expect(
      useRequestsStore.getState().getSkillRequestButtonChildren("ACCEPTED")
    ).toEqual({
      text: "In Progress",
      icon: Hourglass,
    });

    expect(
      useRequestsStore.getState().getSkillRequestButtonChildren("COMPLETED")
    ).toEqual({
      text: "Completed",
      icon: CheckCircle2,
    });

    expect(
      useRequestsStore.getState().getSkillRequestButtonChildren("DECLINED")
    ).toEqual({
      text: "Request Again",
      icon: RotateCcw,
    });
  });
});
