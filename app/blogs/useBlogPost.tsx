import { ChangeEvent, useEffect, useState } from "react";
import {
  filterPage,
  getEffectiveDate,
  SORT_OPTIONS,
  sortPage,
} from "./SORT_OPTIONS";
import { BlogPost } from "./type";
import mockBlogPosts from "./tempData";

export default function useBlogPage() {
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [displayBlogPosts, setDisplayBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.DATE_DESC);

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
      processedPosts = filterPage(processedPosts, lowerCaseSearchTerm);
    }
    const postsToSort = [...processedPosts];
    sortPage(postsToSort, sortOption, getEffectiveDate);
    setDisplayBlogPosts(postsToSort);
  }, [searchTerm, allBlogPosts, sortOption]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const warning = (
    <div
      className="text-center dark:text-gray-400 text-lg mt-8"
      data-testid="no-posts-found"
    >
      No blog posts found. Check back soon!
    </div>
  );
  const loadingText = (
    <div
      className="text-center dark:text-gray-300 text-lg"
      data-testid="loading-indicator"
    >
      Loading posts...
    </div>
  );
  return {
    loadingText,
    warning,
    handleSortChange,
    handleSearchChange,
    displayBlogPosts,
    isLoading,
    searchTerm,
    sortOption,
    allBlogPosts,
  };
}
