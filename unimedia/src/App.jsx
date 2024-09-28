import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));

const Courses = lazy(() => import("./pages/Courses"));

const Allgroup = lazy(() => import("./components/layout/Allgroup"));
const Course = lazy(() => import("./components/course/Course"));

const Events = lazy(() => import("./components/layout/Events"));

const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const PinpostManagement = lazy(() => import("./pages/admin/PinpostManagement"));
const MessagesManagement = lazy(() =>
  import("./pages/admin/MessageManagement")
);
const EventManagement = lazy(() => import("./pages/admin/EventManagement"));
const AccessManagement = lazy(() => import("./pages/admin/AccessManagement"));
const CourseManagement = lazy(() => import("./pages/admin/CourseManagement"));
const StoryManagement = lazy(() => import("./pages/admin/StoryManagement"));
const App = () => {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group" element={<Allgroup />} />
            <Route path="/event" element={<Events />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/*" element={<Course />} />
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
          <Route path="/admin/event" element={<EventManagement />} />
          <Route path="/admin/access" element={<AccessManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/stories" element={<StoryManagement />} />
          <Route path="/admin/pinpost" element={<PinpostManagement />} />
        
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
