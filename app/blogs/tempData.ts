
// ✅ File: components/tempData.ts

import { BlogPost } from "./type";

const mockBlogPosts: BlogPost[] = [
  {
    id: "bp1",
    title: "Understanding Quantum Entanglement",
    slug: "understanding-quantum-entanglement",
    content: `Quantum entanglement is a physical phenomenon that occurs when pairs or groups of particles are generated or interact in ways such that the quantum state of each particle cannot be described independently.\n\nThis is one of the most counterintuitive features of quantum mechanics, challenging classical ideas of locality and realism.`,
    excerpt: "Dive deep into one of the most perplexing phenomena in quantum mechanics: entanglement.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1170&q=80",
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
    content: `Quantum computing algorithms leverage superposition and entanglement to solve problems more efficiently than classical algorithms.\n\nNotable algorithms include Shor’s algorithm for factoring and Grover’s algorithm for searching unsorted databases.`,
    excerpt: "Explore the fundamental algorithms that power quantum computers, like Shor's and Grover's.",
    imageUrl: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1170&q=80",
    published: true,
    publishedAt: "2025-03-15T14:30:00Z",
    createdAt: "2025-03-15T14:00:00Z",
    updatedAt: "2025-03-15T14:15:00Z",
    tags: ["Quantum Computing", "Algorithms", "Technology"],
  },
  {
    id: "bp3",
    title: "The Future of Quantum Sensing",
    slug: "future-of-quantum-sensing",
    content: `Quantum sensing technologies use quantum states and entanglement to achieve precision beyond classical sensors.\n\nThese applications range from biomedical imaging to gravitational wave detection and navigation systems.`,
    excerpt: "How quantum mechanics is revolutionizing sensor technology for unprecedented precision.",
    imageUrl: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1170&q=80",
    published: true,
    publishedAt: "2025-02-20T09:00:00Z",
    createdAt: "2025-02-20T09:00:00Z",
    updatedAt: "2025-02-25T11:00:00Z",
    tags: ["Quantum Sensing", "Future Tech", "Physics"],
  },
  {
    id: "bp4",
    title: "Quantum Cryptography: Securing the Future",
    slug: "quantum-cryptography-securing-the-future",
    content: `Quantum cryptography ensures security by using the principles of quantum mechanics.\n\nQuantum key distribution (QKD) allows two parties to produce a shared random secret key, which is secure against any computational attack.`,
    excerpt: "Explore how quantum mechanics is revolutionizing digital security with concepts like quantum key distribution (QKD).",
    imageUrl: "https://images.unsplash.com/photo-1600267185121-4a295f68f7d3?auto=format&fit=crop&w=1170&q=80",
    published: true,
    publishedAt: "2025-04-10T11:00:00Z",
    createdAt: "2025-04-08T10:00:00Z",
    updatedAt: "2025-04-10T11:15:00Z",
    tags: ["Quantum Cryptography", "Cybersecurity", "QKD"],
  },
  {
    id: "bp5",
    title: "Decoding Quantum Supremacy",
    slug: "decoding-quantum-supremacy",
    content: `Quantum supremacy refers to the point where a quantum computer performs a calculation that is infeasible for any classical computer.\n\nGoogle's Sycamore processor demonstrated this in 2019, marking a historic milestone in the field.`,
    excerpt: "Understand what quantum supremacy means, why it matters, and the companies racing to reach it.",
    imageUrl: "https://images.unsplash.com/photo-1581092335109-2beaaef0e3cf?auto=format&fit=crop&w=1170&q=80",
    published: true,
    publishedAt: "2025-04-01T13:00:00Z",
    createdAt: "2025-03-30T14:00:00Z",
    updatedAt: "2025-04-01T13:45:00Z",
    tags: ["Quantum Supremacy", "Google", "IBM"],
  },
  {
    id: "bp6",
    title: "How Quantum Computers Solve Optimization Problems",
    slug: "quantum-computers-optimize-problems",
    content: `Quantum optimization uses algorithms like quantum annealing and variational quantum eigensolvers (VQE) to tackle complex optimization problems in logistics, finance, and chemistry.`,
    excerpt: "Discover how quantum computing is applied to solve real-world optimization problems using quantum annealing and variational circuits.",
    imageUrl: "https://miro.medium.com/v2/resize:fit:878/1*qln4JW0wnqaPa_aOltek0A.png",
    published: true,
    publishedAt: "2025-04-14T09:00:00Z",
    createdAt: "2025-04-13T08:00:00Z",
    updatedAt: "2025-04-14T09:10:00Z",
    tags: ["Quantum Optimization", "Quantum Annealing", "Finance"],
  },
];

export default mockBlogPosts;


