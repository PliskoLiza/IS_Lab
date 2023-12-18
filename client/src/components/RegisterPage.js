import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import "../css/login.css";

export default function LoginPage() {
    const navigate = useNavigate ();

    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [isTokenValid, setIsTokenValid] = useState(null);

    const debouncedValidateToken = useCallback(
        debounce((token) => validateToken(token), 500),
        []
    );

    const validateToken = async (token) => {
        setIsLoading(true); // Start loading
        setIsTokenValid(null);

        try {
            const response = await fetch(`/api/tokens/is_valid/${token}`);
            if (response.ok) {
                const data = await response.json();
                setIsTokenValid(data.isValid);
            } else {
                setIsTokenValid(false);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsTokenValid(false);
            console.error("Error during token validation:", error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleTokenChange = (e) => {
        setToken(e.target.value);
        debouncedValidateToken(e.target.value);
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        // Perform validation checks here
        if (!email || !password || !token) {
            alert("Please fill in all the fields");
            return;
        }

        // Send registration data to the server
        const registrationData = { email, password, token };

        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                navigate("/login"); // Redirect to the login page
            } else {
                alert("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <div>
            <div className="login_or_register">
                <h1>Registration</h1>
            </div>
        <div className="loging_page">
            <form onSubmit={handleRegistration} className="container">
                <h3>Login</h3>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                <h3>Password</h3>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <h3>Token</h3>
                <div className="token-input-container">
                    <input
                        type="text"
                        placeholder="Token"
                        value={token}
                        onChange={handleTokenChange}
                        className={`token-input.${isTokenValid === false ? 'invalid' : isTokenValid === true ? 'valid' : ''}`}
                        required
                    />
                    {isLoading && <div className="spinner"></div>}
                    {isTokenValid === true && <span>✔️</span>}
                    {isTokenValid === false && <span>❌</span>}
                </div>

                <input type="submit" value="Register" />

                <Link to="/login">
                    <p>Already have an account?</p>
                </Link>
            </form>
        </div>
        </div>
    );
}
