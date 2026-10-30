
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (!formData.email.trim() || !formData.password) {
            setMessage("Please enter email and password.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            const response = await fetch(
                "http://localhost:8100/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: formData.email.trim().toLowerCase(),
                        password: formData.password
                    })
                }
            );

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                data = responseText;
            }

            if (!response.ok) {
                const errorMessage =
                    typeof data === "string"
                        ? data
                        : data?.message || "Login failed.";

                throw new Error(errorMessage);
            }

            if (!data || typeof data !== "object" || !data.Token) {
                throw new Error("Token not received from server.");
            }

            localStorage.setItem("token", data.Token);

            if (data.userId) {
                localStorage.setItem("userId", data.userId);
            }

            setMessage("Login successful!");
            setMessageType("success");

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 800);

        } catch (error) {
            setMessage(error.message);
            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-layout">

                {/* LEFT SIDE - FOOD COLLAGE */}

                <div className="login-visual">

                    <div className="food-collage">

                        <div className="food-tile tile-1">
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                                alt="Healthy salad"
                            />
                        </div>

                        <div className="food-tile tile-2">
                            <img
                                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400"
                                alt="Healthy food"
                            />
                        </div>

                        <div className="food-tile tile-3">
                            <img
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"
                                alt="Healthy meal"
                            />
                        </div>

                        <div className="food-tile tile-4">
                            <img
                                src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400"
                                alt="Nutritious meal"
                            />
                        </div>

                        <div className="food-tile tile-5">
                            <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                                alt="Fresh vegetables"
                            />
                        </div>

                        <div className="food-tile tile-6">
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                                alt="Fresh salad"
                            />
                        </div>

                        <div className="food-tile tile-7">
                            <img
                                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400"
                                alt="Healthy ingredients"
                            />
                        </div>

                        <div className="food-tile tile-8">
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"
                                alt="Green vegetables"
                            />
                        </div>

                        <div className="food-tile tile-9">
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                                alt="Nutrition bowl"
                            />
                        </div>

                        <div className="collage-logo">
                            <span>🥗</span>
                            <strong>NutriTrack</strong>
                        </div>

                    </div>

                    <div className="visual-caption">
                        <h2>Eat Smart. Live Healthy.</h2>
                        <p>
                            Your daily nutrition journey starts here.
                        </p>
                    </div>

                </div>

                {/* RIGHT SIDE - LOGIN CARD */}

                <div className="login-form-section">

                    <div className="login-card">

                        <div className="login-brand">
                            <span className="brand-icon">🥗</span>
                            <span>NutriTrack</span>
                        </div>

                        <h1>WELCOME BACK</h1>

                        <p className="login-subtitle">
                            Sign in to continue your healthy journey
                        </p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="email">Email Address</label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                            <label htmlFor="password">Password</label>

                            <div className="password-field">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                            {message && (
                                <p className={
                                    messageType === "success"
                                        ? "login-success"
                                        : "login-error"
                                }>
                                    {message}
                                </p>
                            )}

                            <div className="forgot-password">
                                <span>Forgot Password?</span>
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading}
                            >
                                {loading ? "SIGNING IN..." : "SIGN IN"}
                            </button>

                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <p className="signup-text">
                            New to NutriTrack?
                            <Link to="/register">Create Account</Link>
                        </p>

                    </div>

                    <p className="bottom-text">
                        © 2026 NutriTrack. Your health, your priority.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;
