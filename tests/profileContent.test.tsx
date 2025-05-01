/* eslint-disable react/display-name */
import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileContent from "../app/user/ProfileContent";
import "@testing-library/jest-dom";

jest.mock("../app/user/UserProfileHeader", () => () => (
  <div data-testid="user-profile-header" />
));
jest.mock("../app/user/Achievement", () => () => (
  <div data-testid="achievement-section" />
));
jest.mock("../app/user/Progress", () => () => (
  <div data-testid="progress-section" />
));
jest.mock("../app/user/GameStats", () => () => (
  <div data-testid="gamestats-section" />
));
jest.mock("@/components/Footer", () => () => <div data-testid="game-footer" />);

describe("ProfileContent", () => {
  it("renders load failure when user is not provided", () => {
    render(
      <ProfileContent
        user={null}
        gameProfile={null}
        editMode={false}
        tempName=""
        handleNameChange={() => {}}
        handleEditToggle={() => {}}
        handleCancelEdit={() => {}}
        // @ts-expect-error ignore
        handleSaveProfile={() => {}}
      />
    );
    expect(screen.getByTestId("profile-load-failure")).toBeInTheDocument();
  });

  it("renders full profile when user is provided", () => {
    const mockUser = { id: "1", name: "Test" };
    const mockGameProfile = { score: 42 };
    const handleNameChange = jest.fn();
    const handleEditToggle = jest.fn();
    const handleCancelEdit = jest.fn();
    const handleSaveProfile = jest.fn();
    render(
      <ProfileContent
        // @ts-expect-error ignore
        user={mockUser}
        // @ts-expect-error ignore
        gameProfile={mockGameProfile}
        editMode={true}
        tempName="Temp"
        handleNameChange={handleNameChange}
        handleEditToggle={handleEditToggle}
        handleCancelEdit={handleCancelEdit}
        handleSaveProfile={handleSaveProfile}
      />
    );
    expect(screen.getByTestId("profile-content-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("profile-main-content")).toBeInTheDocument();
    expect(screen.getByTestId("user-profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("achievement-section")).toBeInTheDocument();
    expect(screen.getByTestId("progress-section")).toBeInTheDocument();
    expect(screen.getByTestId("gamestats-section")).toBeInTheDocument();
    expect(screen.getByTestId("game-footer")).toBeInTheDocument();
  });
});
