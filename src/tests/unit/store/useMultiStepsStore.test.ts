jest.mock("../../../store/useAuthStore", () => ({
  __esModule: true,
  default: {
    getState: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "uuid-1"),
}));

import useMultiStepsStore from "@/store/useMultiStepsStore";
import useAuthStore from "@/store/useAuthStore";

const mockSetCurrentUser = jest.fn();
const mockGetState = useAuthStore.getState as jest.Mock;

describe("useMultiStepsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMultiStepsStore.setState({
      currentStep: 1,
      isSkillDialogOpen: false,
    });

    mockGetState.mockReturnValue({
      currentUser: null,
      setCurrentUser: mockSetCurrentUser,
    });
  });

  it("increments the step when nextPage is called", () => {
    useMultiStepsStore.getState().nextPage();

    expect(useMultiStepsStore.getState().currentStep).toBe(2);
  });

  it("decrements the step and updates user progress when previousPage is called", () => {
    useMultiStepsStore.setState({ currentStep: 3 });
    mockGetState.mockReturnValue({
      currentUser: {
        profile: { signupStepsCompleted: 3 },
        skills: [],
      },
      setCurrentUser: mockSetCurrentUser,
    });

    useMultiStepsStore.getState().previousPage();

    expect(useMultiStepsStore.getState().currentStep).toBe(2);
    expect(mockSetCurrentUser).toHaveBeenCalledWith({
      profile: { signupStepsCompleted: 2 },
      skills: [],
    });
  });

  it("adds a new skill and updates current user skillsReview", async () => {
    mockGetState.mockReturnValue({
      currentUser: {
        profile: { signupStepsCompleted: 2, skillsReview: [] },
        skills: [],
      },
      setCurrentUser: mockSetCurrentUser,
    });

    const setSkillsValue = jest.fn();
    const getSkillsValues = jest.fn().mockReturnValue([]);

    await useMultiStepsStore.getState().handleAddSkill(
      "Test Skill",
      "Test Description",
      setSkillsValue,
      getSkillsValues
    );

    expect(mockSetCurrentUser).toHaveBeenCalledWith({
      profile: {
        signupStepsCompleted: 2,
        skillsReview: [
          {
            id: "uuid-1",
            skillName: "Test Skill",
            skillDesc: "Test Description",
          },
        ],
      },
      skills: [
        {
          id: "uuid-1",
          skillName: "Test Skill",
          skillDesc: "Test Description",
          learnersCount: 0,
        },
      ],
    });
    expect(getSkillsValues).toHaveBeenCalledWith("skills");
    expect(setSkillsValue).toHaveBeenCalledWith("skills", [
      {
        skillName: "Test Skill",
        skillDesc: "Test Description",
      },
    ]);
    expect(useMultiStepsStore.getState().isSkillDialogOpen).toBe(false);
  });
});
