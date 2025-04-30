"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiCalendar } from "react-icons/fi";
import { HiTag } from "react-icons/hi";
import { motion } from "framer-motion";
import { BlogPost } from "../type";

export default function PostPageClient() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data: BlogPost) => setPost(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-500">Loading...</div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-lg text-red-500">
        Post not found.
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center justify-center text-gray-500 space-x-4">
          <FiCalendar className="w-5 h-5" />
          <time dateTime={post.publishedAt?.toString() || undefined}>
            {new Date(post.publishedAt!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {post.imageUrl && (
        <motion.img
          src={post.imageUrl}
          alt={post.title}
          className="w-full rounded-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      <section className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </section>

      <footer className="flex flex-wrap items-center gap-2">
        <HiTag className="w-5 h-5 text-indigo-500" />
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition"
          >
            {tag}
          </span>
        ))}
      </footer>
    </motion.article>
  );
}
