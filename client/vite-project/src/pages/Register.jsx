
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.age ||
            !formData.password
        ) {
            setMessage("Please fill in all fields.");
            setMessageType("error");
            return;
        }

        if (Number(formData.age) < 16) {
            setMessage("Age must be at least 16.");
            setMessageType("error");
            return;
        }

        if (formData.password.length < 6) {
            setMessage("Password must contain at least 6 characters.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:8100/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    age: Number(formData.age),
                    password: formData.password
                })
            });

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                data = { message: responseText };
            }

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            setMessage("Account created successfully!");
            setMessageType("success");

            setFormData({
                name: "",
                email: "",
                age: "",
                password: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setMessage(error.message);
            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-layout">

                {/* LEFT SIDE - FOOD COLLAGE */}

                <div className="register-visual">

                    <div className="register-food-collage">

                        <div className="register-food-tile register-tile-1">
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                                alt="Healthy salad"
                            />
                        </div>

                        <div className="register-food-tile register-tile-2">
                            <img
                                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400"
                                alt="Healthy food"
                            />
                        </div>

                        <div className="register-food-tile register-tile-3">
                            <img
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"
                                alt="Nutritious meal"
                            />
                        </div>

                        <div className="register-food-tile register-tile-4">
                            <img
                                src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400"
                                alt="Fresh vegetables"
                            />
                        </div>

                        <div className="register-food-tile register-tile-5">
                            <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                                alt="Healthy meal bowl"
                            />
                        </div>

                        <div className="register-food-tile register-tile-6">
                            <img
                                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400"
                                alt="Healthy ingredients"
                            />
                        </div>

                        <div className="register-food-tile register-tile-7">
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                                alt="Fresh salad"
                            />
                        </div>

                        <div className="register-food-tile register-tile-8">
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"
                                alt="Green vegetables"
                            />
                        </div>

                        <div className="register-food-tile register-tile-9">
                            <img
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"
                                alt="Healthy food"
                            />
                        </div>

                        <div className="register-collage-logo">
                            <span>🥗</span>
                            <strong>NutriTrack</strong>
                        </div>

                    </div>

                    <div className="register-visual-caption">
                        <h2>Start Your Healthy Journey.</h2>
                        <p>
                            Small steps today. A healthier tomorrow.
                        </p>
                    </div>

                </div>

                {/* RIGHT SIDE - REGISTER FORM */}

                <div className="register-form-section">

                    <div className="register-card">

                        <div className="register-brand">
                            <span>🥗</span>
                            <strong>NutriTrack</strong>
                        </div>

                        <h1>CREATE ACCOUNT</h1>

                        <p className="register-subtitle">
                            Join us and start your nutrition journey
                        </p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="register-name">
                                Full Name
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />

                            <label htmlFor="register-email">
                                Email Address
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                            <label htmlFor="register-age">
                                Age
                            </label>

                            <input
                                id="register-age"
                                type="number"
                                name="age"
                                placeholder="Enter your age"
                                min="16"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="register-password-field">

                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    minLength="6"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-show-password"
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
                                        ? "register-success"
                                        : "register-error"
                                }>
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="register-btn"
                                disabled={loading}
                            >
                                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                            </button>

                        </form>

                        <div className="register-divider">
                            <span>OR</span>
                        </div>

                        <p className="register-login-text">
                            Already have an account?
                            <Link to="/login"> Sign In</Link>
                        </p>

                    </div>

                    <p className="register-bottom-text">
                        © 2026 NutriTrack. Your health, your priority.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;
