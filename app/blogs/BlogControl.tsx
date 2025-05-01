import React, { ChangeEventHandler } from "react";
import { sortOptionsConfig } from "./SORT_OPTIONS";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type BlogControlProp = {
  searchTerm: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  sortOption: string;
  handleSortChange: ChangeEventHandler<HTMLSelectElement>;
};

const BlogControl: React.FC<BlogControlProp> = ({
  searchTerm,
  handleSearchChange,
  sortOption,
  handleSortChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-10 w-full flex flex-col justify-between sm:flex-row gap-4 items-center"
      data-testid="blog-controls"
    >
      <div className="relative flex-grow w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 pl-10 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-sm"
          data-testid="search-input"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />{" "}
      </div>

      <div className="relative w-full sm:w-auto sm:min-w-[200px]">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="w-full px-4 py-3 pr-10 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-sm appearance-none cursor-pointer"
          data-testid="sort-select"
        >
          {sortOptionsConfig.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />{" "}
      </div>
    </motion.div>
  );
};

export default BlogControl;
