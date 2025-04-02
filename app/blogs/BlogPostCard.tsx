import Image from "next/image";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";
import { BlogPost } from "./type";
import { motion } from "framer-motion";

export const BlogPostCard = ({
  post,
  formatDate,
}: {
  post: BlogPost;
  formatDate: (date: string | Date | null | undefined) => string;
}) => {
  const displayDate = post.publishedAt || post.createdAt;
  const isDraft = !post.published;

  return (
    <Link href={`/blog/${post.slug}`} legacyBehavior={false} passHref>
      <motion.div
        layout
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer group h-full"
        whileHover={{ scale: 1.02, y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {post.imageUrl && (
          <div className="relative w-full h-48 flex-shrink-0">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
              {post.excerpt}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto border-t border-gray-100 dark:border-slate-700 pt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>{formatDate(displayDate)}</span>
            </div>
            {isDraft && (
              <span className="text-amber-600 dark:text-amber-400 font-medium bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                Draft
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
