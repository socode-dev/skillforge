import {
  mockAcceptRequest,
  mockCancelRequest,
  mockSendRequest,
  mockDeclineRequest,
  mockRequestCompletion,
  mockConfirmCompletion,
  resetRequestsStore,
  toast,
  useRequestsStore,
} from "./useRequestsStore.testUtils";

describe("useRequestsStore actions", () => {
  beforeEach(() => {
    resetRequestsStore();
  });

  it("calls the send request cloud function and resets loading on success", async () => {
    mockSendRequest.mockResolvedValue({});

    const requestData = {
      skillId: "skill-1",
      skillName: "Test Skill",
      skillDesc: "Test description",
      owner: {
        userId: "owner-1",
        name: "Owner",
        role: "mentor",
      },
      requester: {
        userId: "requester-1",
        name: "Requester",
        role: "learner",
      },
    };

    await useRequestsStore.getState().onSendRequest(requestData);

    expect(mockSendRequest).toHaveBeenCalledWith(requestData);
    expect(toast.success).toHaveBeenCalledWith("Request Sent");
    expect(useRequestsStore.getState().loading.isRequesting["skill-1"]).toBe(false);
  });

  it("shows an error when cancel request is called with an empty id", async () => {
    await useRequestsStore.getState().onCancelRequest("");

    expect(toast.error).toHaveBeenCalledWith("Request Id not found");
    expect(mockCancelRequest).not.toHaveBeenCalled();
  });

  it("calls the accept request cloud function and resets loading on success", async () => {
    mockAcceptRequest.mockResolvedValue({});

    const requestData = {
      requestId: "req-1",
      ownerUserId: "owner-1",
      requesterUserId: "requester-1",
      skillId: "skill-1",
      skillName: "Test Skill",
    };

    await useRequestsStore.getState().onAcceptRequest(requestData);

    expect(mockAcceptRequest).toHaveBeenCalledWith(requestData);
    expect(toast.success).toHaveBeenCalledWith("Request Accepted");
    expect(useRequestsStore.getState().loading.isAccepting["req-1"]).toBe(false);
  });

  it("calls the decline request cloud function and resets loading on success", async () => {
    mockDeclineRequest.mockResolvedValue({});

    await useRequestsStore.getState().onDeclineRequest("req-2");

    expect(mockDeclineRequest).toHaveBeenCalledWith({ requestId: "req-2" });
    expect(toast.success).toHaveBeenCalledWith("Request Declined");
    expect(useRequestsStore.getState().loading.isDeclining["req-2"]).toBe(false);
  });

  it("calls the request completion cloud function and resets loading on success", async () => {
    mockRequestCompletion.mockResolvedValue({});

    await useRequestsStore.getState().onRequestCompletion("req-3");

    expect(mockRequestCompletion).toHaveBeenCalledWith({ requestId: "req-3" });
    expect(toast.success).toHaveBeenCalledWith("Completion requested");
    expect(useRequestsStore.getState().loading.isRequestingCompletion["req-3"]).toBe(false);
  });

  it("calls the confirm completion cloud function and resets loading on success", async () => {
    mockConfirmCompletion.mockResolvedValue({});

    await useRequestsStore.getState().onConfirmCompletion("req-4");

    expect(mockConfirmCompletion).toHaveBeenCalledWith({ requestId: "req-4" });
    expect(toast.success).toHaveBeenCalledWith("Skill completed. Coins released");
    expect(useRequestsStore.getState().loading.isConfirmingCompletion["req-4"]).toBe(false);
  });
});
