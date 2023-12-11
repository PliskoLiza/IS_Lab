import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import "../css/login.css";

export default function LoginPage() {
    const navigate = useNavigate ();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, seterrorMessage] = useState("");


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const handleRegistration = async (e) => {
        e.preventDefault();

        // Perform validation checks here
        if (!email || !password) {
            alert("Please fill in all the fields");
            return;
        }

        // Send registration data to the server
        const registrationData = { email, password };

        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                alert("Registration successfull");
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

                <input type="submit" value="Register" />


                <Link to="/login">
                    <p>Already have an account?</p>
                </Link>
            </form>
        </div>
        </div>
    );
}
