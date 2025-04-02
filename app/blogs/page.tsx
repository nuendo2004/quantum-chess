"use client";

import { motion } from "framer-motion";
import { useEffect, useState, ChangeEvent } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { BlogPost } from "./type";
import { BlogPostCard } from "./BlogPostCard";
import mockBlogPosts from "./tempData";

const SORT_OPTIONS = {
  DATE_DESC: "date-desc",
  DATE_ASC: "date-asc",
  TITLE_ASC: "title-asc",
  TITLE_DESC: "title-desc",
};

const sortOptionsConfig = [
  { value: SORT_OPTIONS.DATE_DESC, label: "Date: Newest First" },
  { value: SORT_OPTIONS.DATE_ASC, label: "Date: Oldest First" },
  { value: SORT_OPTIONS.TITLE_ASC, label: "Title: A-Z" },
  { value: SORT_OPTIONS.TITLE_DESC, label: "Title: Z-A" },
];

export default function BlogPage() {
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [displayBlogPosts, setDisplayBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.DATE_DESC);

  const getEffectiveDate = (post: BlogPost): Date | null => {
    const dateStr = post.publishedAt || post.createdAt;
    if (!dateStr) return null;
    try {
      return new Date(dateStr);
    } catch (e) {
      console.error("Invalid date encountered:", dateStr);
      return null;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllBlogPosts(mockBlogPosts);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let processedPosts = allBlogPosts.filter((post) => post.published);

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      processedPosts = processedPosts.filter((post) => {
        const titleMatch = post.title
          .toLowerCase()
          .includes(lowerCaseSearchTerm);
        const excerptMatch =
          post.excerpt?.toLowerCase().includes(lowerCaseSearchTerm) ?? false;
        const tagMatch = post.tags.some((tag) =>
          tag.toLowerCase().includes(lowerCaseSearchTerm)
        );
        return titleMatch || excerptMatch || tagMatch;
      });
    }

    const postsToSort = [...processedPosts];

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

    setDisplayBlogPosts(postsToSort);
  }, [searchTerm, allBlogPosts, sortOption]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const formatDate = (dateInput: string | Date | null | undefined): string => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <main className="container mx-auto px-6 py-12 flex-grow">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 dark:text-white text-gray-800"
        >
          Quantum Insights Blog
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 w-full flex flex-col justify-between sm:flex-row gap-4 items-center"
        >
          <div className="relative flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-10 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-sm"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />{" "}
          </div>

          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            {/* Control width */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full px-4 py-3 pr-10 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-sm appearance-none cursor-pointer" // appearance-none hides default arrow
            >
              {sortOptionsConfig.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />{" "}
            {/* Custom arrow */}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center dark:text-gray-300 text-lg">
            Loading posts...
          </div>
        ) : allBlogPosts.length > 0 ? (
          displayBlogPosts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayBlogPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  formatDate={formatDate}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center dark:text-gray-400 text-lg mt-8">
              {searchTerm
                ? `No posts match your search "${searchTerm}".`
                : `No posts available.`}
            </div>
          )
        ) : (
          <div className="text-center dark:text-gray-400 text-lg mt-8">
            No blog posts found. Check back soon!
          </div>
        )}
      </main>
    </div>
  );
}
