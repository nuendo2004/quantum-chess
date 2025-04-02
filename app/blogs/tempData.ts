import { BlogPost } from "./type";

const mockBlogPosts: BlogPost[] = [
  {
    id: "bp3",
    title: "The Future of Quantum Sensing",
    slug: "future-of-quantum-sensing",
    content: "How quantum sensors are changing the world...",
    excerpt:
      "How quantum mechanics is revolutionizing sensor technology for unprecedented precision.",
    imageUrl:
      "https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    published: false,
    publishedAt: null,
    createdAt: "2025-02-20T09:00:00Z",
    updatedAt: "2025-02-25T11:00:00Z",
    tags: ["Quantum Sensing", "Future Tech", "Physics"],
  },
  {
    id: "bp1",
    title: "Understanding Quantum Entanglement",
    slug: "understanding-quantum-entanglement",
    content: "Full content about quantum entanglement...",
    excerpt:
      "Dive deep into one of the most perplexing phenomena in quantum mechanics: entanglement.",
    imageUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    published: true,
    publishedAt: "2025-03-28T10:00:00Z",
    createdAt: "2025-03-28T09:00:00Z",
    updatedAt: "2025-03-28T09:30:00Z",
    tags: ["Quantum Mechanics", "Physics", "Entanglement"],
  },
  {
    id: "bp2",
    title: "Introduction to Quantum Computing Algorithms",
    slug: "intro-to-quantum-computing-algorithms",
    content: "Exploring Shor's, Grover's, and other algorithms...",
    excerpt:
      "Explore the fundamental algorithms that power quantum computers, like Shor's and Grover's.",
    imageUrl:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    published: true,
    publishedAt: "2025-03-15T14:30:00Z",
    createdAt: "2025-03-15T14:00:00Z",
    updatedAt: "2025-03-15T14:15:00Z",
    tags: ["Quantum Computing", "Algorithms", "Technology"],
  },
];

export default mockBlogPosts;
