export const currentUser = {
  id: 1,
  name: "Sara Benali",
  handle: "@sara.builds",
  bio: "Frontend developer focused on clean interfaces, thoughtful UX, and shipping useful products.",
  location: "Casablanca, Morocco",
  joinedAt: "Joined March 2024",
  followers: 1280,
  following: 214,
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  coverImage:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
};

export const communities = [
  {
    id: 1,
    slug: "reactjs",
    name: "ReactJS",
    description:
      "A focused space for modern React patterns, UI architecture, and performance work.",
    membersCount: 245_000,
    postsCount: 12_430,
    isJoined: true,
    accent: "from-cyan-500/25 to-blue-500/10",
  },
  {
    id: 2,
    slug: "javascript",
    name: "JavaScript",
    description:
      "Practical JavaScript discussions, debugging, and interview prep.",
    membersCount: 180_500,
    postsCount: 9_820,
    isJoined: true,
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: 3,
    slug: "laravel",
    name: "Laravel",
    description:
      "Backend architecture, Eloquent patterns, and API best practices.",
    membersCount: 97_300,
    postsCount: 5_740,
    isJoined: false,
    accent: "from-emerald-500/20 to-green-500/10",
  },
  {
    id: 4,
    slug: "uiux",
    name: "UI/UX",
    description: "Design systems, motion, accessibility, and product polish.",
    membersCount: 66_920,
    postsCount: 4_210,
    isJoined: false,
    accent: "from-fuchsia-500/20 to-violet-500/10",
  },
];

export const posts = [
  {
    id: 1,
    title: "From Tutorial Hell to Shipping: My 30-Day React Learning Plan",
    content:
      "I spent months jumping between random React videos without building anything real, so I created a 30-day plan that forced me to ship small features every two days. Week 1 was fundamentals (components, props, state, events), week 2 was routing and reusable UI patterns, week 3 introduced async data and form handling, and week 4 was focused on refactoring and polishing UX. The biggest unlock was writing short notes after every coding session and revisiting them before starting a new feature. If you are stuck, stop consuming and start shipping tiny projects that solve one clear problem.",
    votes: 184,
    commentsCount: 46,
    communityId: 1,
    communityName: "r/reactjs",
    communitySlug: "reactjs",
    createdAt: "2h ago",
    readTime: "6 min read",
    isEdited: false,
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Learning", "Frontend"],
    isSaved: true,
    author: {
      name: "Sami Dev",
      handle: "@samicode",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    },
    comments: [
      {
        id: 1,
        author: "Mariam",
        handle: "@mariamui",
        avatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80",
        body: "This is the kind of plan that actually works. Small shipping loops are underrated.",
        createdAt: "1h ago",
      },
      {
        id: 2,
        author: "Hassan",
        handle: "@hassanbuilds",
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=120&q=80",
        body: "I like the idea of revisiting short notes before each feature. Nice habit.",
        createdAt: "45m ago",
      },
      {
        id: 2,
        author: "Hassan",
        handle: "@hassanbuilds",
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=120&q=80",
        body: "I like the idea of revisiting short notes before each feature. Nice habit.",
        createdAt: "45m ago",
      },
      {
        id: 2,
        author: "Hassan",
        handle: "@hassanbuilds",
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=120&q=80",
        body: "I like the idea of revisiting short notes before each feature. Nice habit.",
        createdAt: "45m ago",
      },
      {
        id: 2,
        author: "Hassan",
        handle: "@hassanbuilds",
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=120&q=80",
        body: "I like the idea of revisiting short notes before each feature. Nice habit.",
        createdAt: "45m ago",
      },
    ],
  },
  {
    id: 2,
    title: "JavaScript Interview Prep Notes That Actually Helped Me",
    content:
      "Most interview prep lists are too broad, so I narrowed mine to a few high-impact topics: closures, event loop, async/await, array methods, and object references. Every day I solved two small exercises and explained the solution out loud as if teaching a junior developer. This improved both recall and communication. I also created a tiny playground project where I rewrote utility functions from scratch. By the end of two weeks, I could answer common JS questions with confidence and without memorized scripts.",
    votes: 129,
    commentsCount: 31,
    communityId: 2,
    communityName: "r/javascript",
    communitySlug: "javascript",
    createdAt: "5h ago",
    readTime: "4 min read",
    isEdited: true,
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    tags: ["JavaScript", "Interview", "Practice"],
    isSaved: false,
    author: {
      name: "Leila Frontend",
      handle: "@leila.codes",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    },
    comments: [
      {
        id: 1,
        author: "Younes",
        handle: "@younesdev",
        avatar:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=120&q=80",
        body: "Closures and event loop alone solve so many interview questions.",
        createdAt: "3h ago",
      },
    ],
  },
  {
    id: 3,
    title: "Laravel API Architecture for Side Projects: Keep It Simple",
    content:
      "When building APIs for side projects, I used to over-engineer everything with complex folder structures and abstractions too early. Now I keep it practical: clear resource routes, request validation, service classes only when repeated logic appears, and concise API responses. I also add pagination and error handling from day one, because they are always needed later. This approach made my codebase easier to maintain and faster to evolve when requirements changed.",
    votes: 97,
    commentsCount: 18,
    communityId: 3,
    communityName: "r/laravel",
    communitySlug: "laravel",
    createdAt: "1d ago",
    readTime: "5 min read",
    isEdited: false,
    tags: ["Laravel", "API", "Architecture"],
    isSaved: true,
    author: {
      name: "Youssef Backend",
      handle: "@youssefphp",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    },
    comments: [
      {
        id: 1,
        author: "Amina",
        handle: "@aminacodes",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
        body: "Simple architecture wins in side projects. Too much abstraction slows shipping.",
        createdAt: "20h ago",
      },
    ],
  },
  {
    id: 4,
    title: "Designing a Dark SaaS UI That Still Feels Warm",
    content:
      "Dark UIs can quickly feel cold if every surface is the same shade. I started adding depth with layered cards, soft borders, muted glows, and slightly warmer neutral text. The key is restraint: one or two accents, consistent spacing, and a clear rhythm between content blocks. The result feels modern without becoming flashy. I also think responsive layout decisions matter more than people admit because the same visual can collapse badly on mobile if the hierarchy is not planned early.",
    votes: 153,
    commentsCount: 24,
    communityId: 4,
    communityName: "r/uiux",
    communitySlug: "uiux",
    createdAt: "2d ago",
    readTime: "7 min read",
    isEdited: false,
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    tags: ["UI", "Design Systems", "Accessibility"],
    isSaved: false,
    author: {
      name: "Nadia Studio",
      handle: "@nadia.studio",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    },
    comments: [
      {
        id: 1,
        author: "Sara",
        handle: "@sara.builds",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        body: "This is exactly why your auth page looks polished. The restraint shows.",
        createdAt: "12h ago",
      },
    ],
  },
  {
    id: 5,
    title: "Why I stopped overusing Redux in product apps",
    content:
      "Redux still has a place, but I learned to separate server state from UI state. Query libraries handle remote data, caching, and background sync much better than hand-rolled state. Redux is now reserved for truly global UI concerns or predictable app-level state. This made my code simpler, my components thinner, and debugging easier. The biggest benefit is that new pages can read data without every screen duplicating loading and refetch logic.",
    votes: 88,
    commentsCount: 17,
    communityId: 1,
    communityName: "r/reactjs",
    communitySlug: "reactjs",
    createdAt: "3d ago",
    readTime: "5 min read",
    isEdited: true,
    tags: ["Redux", "State Management", "Architecture"],
    isSaved: false,
    author: {
      name: "Omar Stack",
      handle: "@omarstack",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    },
    comments: [
      {
        id: 1,
        author: "Leila Frontend",
        handle: "@leila.codes",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        body: "This is the mental model I keep trying to explain to juniors.",
        createdAt: "2d ago",
      },
    ],
  },
];

export const notifications = [
  {
    id: 1,
    title: "New comment on your post",
    body: "Mariam commented on your React learning plan.",
    createdAt: "15m ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Community update",
    body: "r/uiux reached 67k members this week.",
    createdAt: "2h ago",
    isRead: true,
  },
  {
    id: 3,
    title: "Saved post reminder",
    body: "Your saved Laravel architecture post has a new reply.",
    createdAt: "6h ago",
    isRead: true,
  },
  {
    id: 4,
    title: "Weekly digest ready",
    body: "Your personalized devTribe digest is waiting.",
    createdAt: "1d ago",
    isRead: false,
  },
];

export const trendingTopics = [
  "React Server Components",
  "TanStack Query",
  "Laravel APIs",
  "Design Systems",
  "Redux Toolkit",
  "TypeScript Patterns",
];

export const savedPostIds = [1, 3];
