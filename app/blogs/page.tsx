// ✅ File: app/blogs/page.tsx

"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BlogPost } from "../../components/type";
import { BlogPostCard } from "../../components/BlogPostCard";
import mockBlogPosts from "../../components/tempData";

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
  const [displayBlogPosts, setDisplayBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.DATE_DESC);

  useEffect(() => {
    let filtered = mockBlogPosts.filter(post => post.published);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt?.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      switch (sortOption) {
        case SORT_OPTIONS.DATE_ASC:
          return dateA - dateB;
        case SORT_OPTIONS.DATE_DESC:
          return dateB - dateA;
        case SORT_OPTIONS.TITLE_ASC:
          return a.title.localeCompare(b.title);
        case SORT_OPTIONS.TITLE_DESC:
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setDisplayBlogPosts(filtered);
  }, [searchTerm, sortOption]);

  const formatDate = (date: string | Date | null | undefined): string => {
    return new Date(date || "").toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Quantum Insights Blog
        </h1>

        <div className="mb-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-1/2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
            >
              {sortOptionsConfig.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronUpDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogPosts.map(post => (
            <BlogPostCard key={post.id} post={post} formatDate={formatDate} />
          ))}
        </div>
      </div>
    </div>
  );
}
