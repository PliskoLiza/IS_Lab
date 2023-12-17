import React, { useContext } from "react";

import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
  useParams,
  Navigate
} from "react-router-dom";

import './css/main.css';

import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import NotFound from './components/NotFoundPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';
import PrivateRoute from "./components/PrivateRoute";
import GuestProfilePage from './components/GuestProfilePage';

// authentification handler
import { AuthContext, AuthProvider } from "./components/AuthContext";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="root">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path='/profile/:email' element={<ProfileChecker />} />
              <Route exact path='/profile' element={<PrivateRoute />}>
              <Route exact path='/profile' element={<ProfilePage />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ProfileChecker() {
  const { email } = useParams();
  const { user } = useContext(AuthContext);

  if (user && user.email === email) {
    return <Navigate to="/profile" replace />;
  }

  return <GuestProfilePage />;
}
