import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from './components/AuthProvider';
import AuthRequired from "./components/AuthRequired";
import Layout from "./components/Layout";
import Feed from "./components/Feed";
import ArticleView from "./components/ArticleView";
import Comments from "./components/Comments";
import Search from "./components/Search";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import FollowerList from "./components/FollowerList";
import FollowingList from "./components/FollowingList";
import Accounts from "./components/Accounts";
import NotFound from "./components/NotFound";

export default function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <AuthRequired>
              <Layout />
            </AuthRequired>
          }>
            <Route index element={<Feed />} />
            <Route path="search" element={<Search />} />
            <Route path="p/:id">
              <Route index element={<ArticleView />} />
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="profiles/:username">
              <Route index element={<Profile />} />
              <Route path="followers" element={<FollowerList />} />
              <Route path="following" element={<FollowingList />} />
            </Route>
            <Route path="accounts/edit" element={<Accounts />} />
          </Route>
          <Route path="accounts/login" element={<Login />} />
          <Route path="accounts/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}