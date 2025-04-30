// app/blogs/[slug]/page.tsx

import { notFound } from "next/navigation";
import mockBlogPosts from "../../../components/tempData";
import { BlogPost } from "../../../components/type";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post: BlogPost | undefined = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post || !post.published) return notFound();

  const enrichedContent = `${post.content}

---

## Why This Matters

Quantum technologies are no longer confined to theoretical research. Their applications are transforming fields like secure communication, AI acceleration, and precision measurement.

## Key Takeaways

- Quantum Entanglement defies classical logic.
- Quantum Algorithms offer exponential speedups.
- Quantum Sensing and Cryptography are ready for real-world deployment.
- Optimization problems are ideal for quantum acceleration.

## Further Reading

- [Quantum Computing Primer](https://quantum.country/qcvc)
- [IBM Quantum Blog](https://research.ibm.com/blog/quantum)
- [Quantum Open Source Foundation](https://qosf.org)`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Published on {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
        </p>
        {post.imageUrl && (
          <div className="relative w-full h-64 mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{enrichedContent}</ReactMarkdown>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
