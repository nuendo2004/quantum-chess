import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProfilePage from "../app/user/page";
import { useUserProfile } from "../app/user/useUserProfile";

jest.mock("../app/user/useUserProfile");
const mockedUseUserProfile = useUserProfile as jest.MockedFunction<
  typeof useUserProfile
>;

// eslint-disable-next-line react/display-name
jest.mock("@/components/LoadingIndicator", () => () => (
  <div data-testid="loading-indicator">Loading...</div>
));
jest.mock("@/components/ErrorDisplay", () =>
  // eslint-disable-next-line react/display-name
  ({ error }: { error: string | Error }) => (
    <div data-testid="error-display">
      {typeof error === "string" ? error : error.message}
    </div>
  )
);
jest.mock("../app/user/ProfileContent", () =>
  jest.fn((props) => (
    <div data-testid="profile-content" data-props={JSON.stringify(props)}>
      Profile Content
    </div>
  ))
);

const getDefaultHookState = (): ReturnType<typeof useUserProfile> => ({
  user: null,
  gameProfile: null,
  isLoading: true,
  error: null,
  editMode: false,
  tempName: "",
  handleNameChange: jest.fn(),
  handleEditToggle: jest.fn(),
  handleCancelEdit: jest.fn(),
  handleSaveProfile: jest.fn(),
  status: "loading",
  isAuthenticated: false,
});

describe("ProfilePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseUserProfile.mockReturnValue(getDefaultHookState());
  });

  it("should render LoadingIndicator when isLoading is true", () => {
    mockedUseUserProfile.mockReturnValue({
      ...getDefaultHookState(),
      isLoading: true,
      status: "loading",
    });

    render(<ProfilePage />);

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    expect(screen.queryByTestId("error-display")).not.toBeInTheDocument();
    expect(screen.queryByTestId("profile-content")).not.toBeInTheDocument();
  });

  it("should render ErrorDisplay when an error occurs", () => {
    const testError = new Error("Failed to fetch profile");
    mockedUseUserProfile.mockReturnValue({
      ...getDefaultHookState(),
      isLoading: false,
      // @ts-expect-error ignore
      error: testError,
      status: "authenticated",
    });

    render(<ProfilePage />);

    expect(screen.getByTestId("error-display")).toBeInTheDocument();
    expect(screen.getByText(testError.message)).toBeInTheDocument();
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("profile-content")).not.toBeInTheDocument();
  });

  it("should render ErrorDisplay with login message if user is null and status is unauthenticated", () => {
    mockedUseUserProfile.mockReturnValue({
      ...getDefaultHookState(),
      isLoading: false,
      user: null,
      error: null,
      status: "unauthenticated",
    });

    render(<ProfilePage />);

    expect(screen.getByTestId("error-display")).toBeInTheDocument();
    expect(
      screen.getByText("Please log in to view your profile.")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("profile-content")).not.toBeInTheDocument();
  });
});
