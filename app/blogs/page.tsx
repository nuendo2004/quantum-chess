"use client";

import { motion } from "framer-motion";
import { BlogPostCard } from "./BlogPostCard";
import BlogControl from "./BlogControl";
import useBlogPage from "./useBlogPost";
import { formatDate } from "./SORT_OPTIONS";

export default function BlogPage() {
  const {
    loadingText,
    warning,
    handleSortChange,
    handleSearchChange,
    displayBlogPosts,
    isLoading,
    searchTerm,
    sortOption,
    allBlogPosts,
  } = useBlogPage();
  const postcards = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      data-testid="blog-post-grid"
    >
      {displayBlogPosts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          formatDate={formatDate}
          data-testid={`blog-post-card-${post.id}`} // Pass down test id or handle inside BlogPostCard
        />
      ))}
    </motion.div>
  );
  const searches = (
    <div
      className="text-center dark:text-gray-400 text-lg mt-8"
      data-testid="no-matching-posts"
    >
      {searchTerm
        ? `No posts match your search "${searchTerm}".`
        : `No posts available.`}
    </div>
  );
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex flex-col"
      data-testid="blog-page-container"
    >
      <main className="container mx-auto px-6 py-12 flex-grow">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 dark:text-white text-gray-800"
          data-testid="blog-page-title"
        >
          Quantum Insights Blog
        </motion.h1>

        <BlogControl
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />

        {isLoading
          ? loadingText
          : allBlogPosts.length > 0
          ? displayBlogPosts.length > 0
            ? postcards
            : searches
          : warning}
      </main>
    </div>
  );
}
