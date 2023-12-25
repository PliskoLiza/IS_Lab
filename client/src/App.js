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
import ManagementPage from './components/ManagementPage';
import LoginPage from './components/LoginPage';
import NotFound from './components/NotFoundPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';
import PrivateRoute from "./components/PrivateRoute";
import AdminPage from './components/AdminPage';
import HighLevelManagement from './components/HighLevelManagement'

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
              <Route exact path='/' element={<PrivateRoute />} >
                <Route exact path='/' element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route exact path='/profile' element={<PrivateRoute />} >
                <Route exact path='/profile' element={<ProfilePage />} />
              </Route>
              <Route path="/management" element={<ManagementPage />} />
              <Route path="/hll-management" element={<HighLevelManagement />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
