"use client";

import { BlogPost } from "./type";

export const SORT_OPTIONS = {
  DATE_DESC: "date-desc",
  DATE_ASC: "date-asc",
  TITLE_ASC: "title-asc",
  TITLE_DESC: "title-desc",
};
export const sortOptionsConfig = [
  { value: SORT_OPTIONS.DATE_DESC, label: "Date: Newest First" },
  { value: SORT_OPTIONS.DATE_ASC, label: "Date: Oldest First" },
  { value: SORT_OPTIONS.TITLE_ASC, label: "Title: A-Z" },
  { value: SORT_OPTIONS.TITLE_DESC, label: "Title: Z-A" },
];

export function filterPage(
  processedPosts: BlogPost[],
  lowerCaseSearchTerm: string
) {
  processedPosts = processedPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(lowerCaseSearchTerm);
    const excerptMatch =
      post.excerpt?.toLowerCase().includes(lowerCaseSearchTerm) ?? false;
    const tagMatch = post.tags.some((tag) =>
      tag.toLowerCase().includes(lowerCaseSearchTerm)
    );
    return titleMatch || excerptMatch || tagMatch;
  });
  return processedPosts;
}

export function sortPage(
  postsToSort: BlogPost[],
  sortOption: string,
  getEffectiveDate: (post: BlogPost) => Date | null
) {
  postsToSort.sort((a, b) => {
    switch (sortOption) {
      case SORT_OPTIONS.TITLE_ASC:
        return a.title.localeCompare(b.title);
      case SORT_OPTIONS.TITLE_DESC:
        return b.title.localeCompare(a.title);
      case SORT_OPTIONS.DATE_ASC: {
        const dateA = getEffectiveDate(a);
        const dateB = getEffectiveDate(b);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      }
      case SORT_OPTIONS.DATE_DESC:
      default: {
        const dateA = getEffectiveDate(a);
        const dateB = getEffectiveDate(b);
        if (!dateA) return -1;
        if (!dateB) return 1;
        return dateB.getTime() - dateA.getTime();
      }
    }
  });
}

export const getEffectiveDate = (post: BlogPost): Date | null => {
  const dateStr = post.publishedAt || post.createdAt;
  if (!dateStr) return null;
  try {
    return new Date(dateStr);
  } catch (e) {
    console.error("Invalid date encountered:", dateStr, e);
    return null;
  }
};

export const formatDate = (
  dateInput: string | Date | null | undefined
): string => {
  if (!dateInput) return "";
  try {
    return new Date(dateInput).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", dateInput, e);
    return "Invalid Date";
  }
};
