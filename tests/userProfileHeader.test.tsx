import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfileHeader from "@/app/user/UserProfileHeader";
import "@testing-library/jest-dom";

describe("UserProfileHeader", () => {
  const mockUser = {
    image: "/avatar.png",
    name: "John Doe",
    email: "john@example.com",
    dateCreated: "2023-01-01T00:00:00.000Z",
  };
  const onNameChange = jest.fn();
  const onSave = jest.fn();
  const onEditToggle = jest.fn();
  const onCancelEdit = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      user: mockUser,
      editMode: false,
      tempName: mockUser.name,
      onNameChange,
      onSave,
      onEditToggle,
      onCancelEdit,
      ...props,
    };

    // @ts-expect-error ignore
    render(<UserProfileHeader {...defaultProps} />);
  };

  it("renders user avatar, name, email, and member since", () => {
    renderComponent();
    const avatar = screen.getByTestId("user-avatar");
    expect(avatar).toHaveAttribute("src");
    expect(screen.getByTestId("user-name-display")).toHaveTextContent(
      "John Doe"
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "john@example.com"
    );
    expect(screen.getByTestId("user-member-since")).toHaveTextContent(
      /Member since December 31, 2022/
    );
  });

  it("calls onEditToggle when Edit Name button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("edit-name-button"));
    expect(onEditToggle).toHaveBeenCalled();
  });

  it("renders input and buttons in edit mode", () => {
    renderComponent({ editMode: true, tempName: "Jane Doe" });
    expect(screen.getByTestId("user-name-input")).toBeInTheDocument();
    const saveButton = screen.getByTestId("save-name-button");
    const cancelButton = screen.getByTestId("cancel-edit-name-button");
    expect(saveButton).toBeEnabled();
    expect(cancelButton).toBeInTheDocument();
  });

  it("disables save button when tempName is empty or unchanged", () => {
    renderComponent({ editMode: true, tempName: "" });
    expect(screen.getAllByTestId("save-name-button")[0]).toBeDisabled();
    renderComponent({ editMode: true, tempName: mockUser.name });
    expect(screen.getAllByTestId("save-name-button")[0]).toBeDisabled();
  });

  it("calls onSave and onCancelEdit appropriately", () => {
    renderComponent({ editMode: true, tempName: "Jane Doe" });
    fireEvent.click(screen.getByTestId("save-name-button"));
    expect(onSave).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("cancel-edit-name-button"));
    expect(onCancelEdit).toHaveBeenCalled();
  });

  it("falls back to default avatar on error", () => {
    renderComponent({ user: { ...mockUser, image: undefined } });
    const avatar = screen.getByTestId("user-avatar") as HTMLImageElement;
    fireEvent.error(avatar);
    expect(avatar.src).toContain("/default-avatar.png");
  });
});
