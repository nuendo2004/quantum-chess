import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogPage from "../app/blogs/page";

jest.mock("framer-motion", () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
    h1: jest.fn(({ children, ...props }) => <h1 {...props}>{children}</h1>),
  },
}));

jest.mock("@heroicons/react/24/outline", () => ({
  // @ts-expect-error test
  MagnifyingGlassIcon: (props) => (
    <svg data-testid="magnifying-glass-icon" {...props} />
  ),
  // @ts-expect-error test
  ChevronUpDownIcon: (props) => (
    <svg data-testid="chevron-up-down-icon" {...props} />
  ),
}));

jest.mock("../app/blogs/BlogPostCard", () => ({
  // @ts-expect-error test
  BlogPostCard: ({ post, formatDate, ...props }) => (
    <div data-testid={props["data-testid"] || `blog-post-card-${post.id}`}>
      <h3>{post.title}</h3>
      <p>
        {formatDate
          ? formatDate(post.publishedAt || post.createdAt)
          : post.publishedAt || post.createdAt}
      </p>
    </div>
  ),
}));

jest.mock("../app/blogs/tempData", () => [
  {
    id: "1",
    title: "Zebra Adventures",
    publishedAt: "2023-01-15T10:00:00Z",
    createdAt: "2023-01-10T09:00:00Z",
    published: true,
    tags: ["nature", "animals"],
    excerpt: "Exploring the wild.",
  },
  {
    id: "2",
    title: "Apple Recipes",
    publishedAt: "2023-03-20T14:30:00Z",
    createdAt: "2023-03-19T11:00:00Z",
    published: true,
    tags: ["food", "cooking"],
    excerpt: "Delicious apple pies.",
  },
  {
    id: "3",
    title: "Beta Testing Basics",
    publishedAt: null,
    createdAt: "2023-02-01T12:00:00Z",
    published: true,
    tags: ["tech", "software"],
    excerpt: "Getting started with testing.",
  },
  {
    id: "4",
    title: "Unpublished Draft",
    publishedAt: null,
    createdAt: "2023-04-01T10:00:00Z",
    published: false,
    tags: ["draft"],
    excerpt: "Work in progress.",
  },
]);

describe("BlogPage Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("renders initial loading state correctly", () => {
    render(<BlogPage />);

    expect(screen.getByTestId("blog-page-title")).toHaveTextContent(
      "Quantum Insights Blog"
    );
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("sort-select")).toBeInTheDocument();
    expect(screen.getByTestId("loading-indicator")).toHaveTextContent(
      "Loading posts..."
    );

    expect(screen.queryByTestId("blog-post-grid")).not.toBeInTheDocument();
    expect(screen.queryByTestId("no-matching-posts")).not.toBeInTheDocument();
    expect(screen.queryByTestId("no-posts-found")).not.toBeInTheDocument();
  });

  test("loads and displays blog posts after timeout", async () => {
    render(<BlogPage />);

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
      expect(screen.getByTestId("blog-post-grid")).toBeInTheDocument();
    });

    const cards = screen.getAllByTestId(/blog-post-card-/);
    expect(cards).toHaveLength(3);

    expect(cards[0]).toHaveTextContent("Apple Recipes");
    expect(cards[1]).toHaveTextContent("Beta Testing Basics");
    expect(cards[2]).toHaveTextContent("Zebra Adventures");
  });

  test("filters posts based on search term", async () => {
    render(<BlogPage />);
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByTestId("blog-post-grid")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "apple" } });

    await waitFor(() => {
      const cards = screen.getAllByTestId(/blog-post-card-/);
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveTextContent("Apple Recipes");
    });

    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(screen.queryByTestId("blog-post-grid")).not.toBeInTheDocument();
      expect(screen.getByTestId("no-matching-posts")).toHaveTextContent(
        'No posts match your search "nonexistent".'
      );
    });
  });

  test("filters posts based on tag in search term", async () => {
    render(<BlogPage />);
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByTestId("blog-post-grid")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "tech" } });

    await waitFor(() => {
      const cards = screen.getAllByTestId(/blog-post-card-/);
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveTextContent("Beta Testing Basics");
    });
  });

  test("sorts posts by title A-Z", async () => {
    render(<BlogPage />);
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByTestId("blog-post-grid")).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "title-asc" } });

    await waitFor(() => {
      const cards = screen.getAllByTestId(/blog-post-card-/);
      expect(cards).toHaveLength(3);
      expect(cards[0]).toHaveTextContent("Apple Recipes");
      expect(cards[1]).toHaveTextContent("Beta Testing Basics");
      expect(cards[2]).toHaveTextContent("Zebra Adventures");
    });
  });

  test("sorts posts by title Z-A", async () => {
    render(<BlogPage />);
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByTestId("blog-post-grid")).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "title-desc" } });

    await waitFor(() => {
      const cards = screen.getAllByTestId(/blog-post-card-/);
      expect(cards).toHaveLength(3);
      expect(cards[0]).toHaveTextContent("Zebra Adventures");
      expect(cards[1]).toHaveTextContent("Beta Testing Basics");
      expect(cards[2]).toHaveTextContent("Apple Recipes");
    });
  });

  test("sorts posts by date Oldest First", async () => {
    render(<BlogPage />);
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByTestId("blog-post-grid")).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "date-asc" } });

    await waitFor(() => {
      const cards = screen.getAllByTestId(/blog-post-card-/);
      expect(cards).toHaveLength(3);
      expect(cards[0]).toHaveTextContent("Zebra Adventures");
      expect(cards[1]).toHaveTextContent("Beta Testing Basics");
      expect(cards[2]).toHaveTextContent("Apple Recipes");
    });
  });
});
