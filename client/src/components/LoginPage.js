import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      setError("");
      navigate("/");
    } catch (error) {
      setError(error.toString());
    }
  };

  return (
      <div>
        <div className="login_or_register">
          <h1>Login</h1>
        </div>

        <div className="loging_page">
          <form onSubmit={handleSubmit} className="container">
            {error && <p className="error-message">{error}</p>}
            <h3>Login</h3>
            <input
                type="text"
                placeholder="Login"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <h3>Password</h3>
            <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <input type="submit" value="Login"/>
          </form>
          <div className="register-link">
            <Link to="/register">
              <p>Don't have an account? Register</p>
            </Link>
          </div>
        </div>
      </div>


  );
}
