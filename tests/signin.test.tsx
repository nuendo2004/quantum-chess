// SignIn.test.tsx
import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "../app/signin/page";
import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
import React from "react";

// Mock next-auth/react signIn function
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock useRouter from next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock GoogleSVG to avoid SVG issues
jest.mock("@/svg/GoogleSVG", () => () => "GoogleSVG");

describe("SignIn Component", () => {
  const mockSignIn = signIn as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders email and password inputs, login button, Google sign-in, and signup link", () => {
    render(<SignIn />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();
  });

  it("calls signIn with credentials when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      redirect: true,
      email: "test@example.com",
      password: "password",
    });
  });

  it("redirects to home on successful login", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: null });
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  it("displays error message on failed login", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid credentials";
    mockSignIn.mockResolvedValueOnce({ error: errorMessage });
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("calls signIn with Google provider when Google button is clicked", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.click(
      screen.getByRole("button", { name: /continue with google/i })
    );

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/home",
    });
  });

  it("redirects to signup page when signup link is clicked", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.click(screen.getByText("Here"));

    expect(mockPush).toHaveBeenCalledWith("/signup");
  });
});
