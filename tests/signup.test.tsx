import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "@/app/signup/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("crypto", () => ({
  randomUUID: () => "mocked-uuid",
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    //@ts-expect-error modify global
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    jest.clearAllMocks();
  });

  test("renders form elements", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Image")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Google" })
    ).toBeInTheDocument();
  });

  test("updates input values correctly", () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput).toHaveValue("password123");

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    expect(nameInput).toHaveValue("Test");
  });

  test("handles successful form submission", async () => {
    const mockPush = jest.fn();
    (useRouter().push as jest.Mock) = mockPush;

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Image"), {
      target: { value: "http://image.com" },
    });

    fireEvent.click(screen.getByTestId("signup-button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test("displays error message on failed submission", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Signup failed" }),
    });

    render(<SignUp />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Signup failed")).toBeInTheDocument();
    });
  });

  test("handles Google sign-in", () => {
    render(<SignUp />);

    fireEvent.click(
      screen.getByRole("button", { name: "Continue with Google" })
    );
    expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/home" });
  });

  test("validates required fields", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password")).toBeRequired();
    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Image")).not.toBeRequired();
  });
});
