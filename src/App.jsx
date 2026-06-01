import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ManageCommunities from "./pages/ManageCommunities";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AppLayout from "./ui/AppLayout";
import Notifications from "./pages/Notifications";
import PopularPosts from "./pages/PopularPosts";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";
import PostModeration from "./pages/PostModeration";
import CommunityModerationQueue from "./pages/CommunityModerationQueue";
import ProtectedRoute from "./ui/ProtectedRoute";
import PublicRoute from "./ui/PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/home" replace />,
          },
          {
            path: "/home",
            element: <Home />,
          },
          {
            path: "/communities",
            element: <Communities />,
          },
          {
            path: "/community/:id",
            element: <CommunityDetail />,
          },
          {
            path: "/community/:identifier/moderation",
            element: <CommunityModerationQueue />,
          },
          {
            path: "/post/:id",
            element: <PostDetail />,
          },
          {
            path: "/post/:id/edit",
            element: <EditPost />,
          },
          {
            path: "/post/:id/moderate",
            element: <PostModeration />,
          },
          {
            path: "/create-post",
            element: <CreatePost />,
          },
          {
            path: "/manage-communities",
            element: <ManageCommunities />,
          },
          {
            path: "/profile",
            children: [
              { index: true, element: <Profile /> },
              { path: ":username", element: <UserProfile /> },
            ],
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/popular",
            element: <PopularPosts />,
          },
          {
            path: "/explore",
            element: <Explore />,
          },
          {
            path: "/search",
            element: <Search />,
          },
          {
            path: "/saved",
            element: <Saved />,
          },
          {
            path: "/messages",
            children: [
              { index: true, element: <Messages /> },
              { path: ":userId", element: <Messages /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

// features :
// 1. authentication (signup, login, logout)
// 2. home page (feed of posts from communities the user is part of)
// 3. communities page (list of all communities, with option to join/leave)
// 4. community detail page (list of posts in the community, with option to create post)
// 5. post detail page (post content, comments, upvote/downvote)
// 6. create post page (form to create a new post)
// 7. profile page (user info, list of user's posts and comments)
// 8. saved posts page (list of posts the user has saved)
