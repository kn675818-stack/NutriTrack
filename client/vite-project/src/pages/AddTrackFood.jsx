
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTrackFood.css";

// Get today's date in YYYY-MM-DD format for the date input
const getTodayISO = () => {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
};

// Convert YYYY-MM-DD to M/D/YYYY for your backend
const formatDateForBackend = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${Number(month)}/${Number(day)}/${year}`;
};

function AddTrackFood() {
    const navigate = useNavigate();

    const [foods, setFoods] = useState([]);
    const [foodId, setFoodId] = useState("");
    const [quantity, setQuantity] = useState("100");
    const [date, setDate] = useState(getTodayISO());

    const [loading, setLoading] = useState(false);
    const [foodsLoading, setFoodsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!token || !userId) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchFoods = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8100/getfoods",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    navigate("/login", { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error("Unable to load foods");
                }

                const data = await response.json();
                setFoods(Array.isArray(data) ? data : []);

            } catch (err) {
                setError(err.message);
            } finally {
                setFoodsLoading(false);
            }
        };

        fetchFoods();
    }, [token, userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!foodId) {
            setError("Please select a food.");
            return;
        }

        if (!quantity || Number(quantity) <= 0) {
            setError("Please enter a valid quantity.");
            return;
        }

        try {
            setLoading(true);

            const userFood = {
                userId: userId,
                foodId: foodId,
                date: formatDateForBackend(date),
                quantity: Number(quantity)
            };

            const response = await fetch(
                "http://localhost:8100/addfoodtrack",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userFood)
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login", { replace: true });
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to add food.");
            }

            setMessage("Food added successfully!");
            setFoodId("");
            setQuantity("100");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="track-page">

            <nav className="track-navbar">
                <h2>NutriTrack</h2>

                <div>
                    <button onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>

                    <button onClick={() => navigate("/foods")}>
                        Foods
                    </button>

                    <button onClick={() => navigate("/history")}>
                        History
                    </button>
                </div>
            </nav>

            <div className="track-container">

                <h1>Track Your Food</h1>

                <p className="track-subtitle">
                    Add the food you have eaten to your daily record.
                </p>

                <form onSubmit={handleSubmit} className="track-form">

                    <label>Select Food</label>

                    <select
                        value={foodId}
                        onChange={(e) => setFoodId(e.target.value)}
                        required
                    >
                        <option value="">
                            {foodsLoading ? "Loading foods..." : "Choose a food"}
                        </option>

                        {foods.map((food) => (
                            <option key={food._id} value={food._id}>
                                {food.name}
                            </option>
                        ))}
                    </select>

                    <label>Quantity</label>

                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        required
                    />

                    <p className="track-subtitle">
                        Enter the quantity in the same unit as the food's serving size.
                    </p>

                    <label>Date</label>

                    <input
                        type="date"
                        value={date}
                        max={getTodayISO()}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || foodsLoading}
                        className="track-submit"
                    >
                        {loading ? "Adding..." : "Add Food to Track"}
                    </button>

                    {message && (
                        <p className="track-message">{message}</p>
                    )}

                    {error && (
                        <p className="track-error">{error}</p>
                    )}

                </form>

            </div>
        </div>
    );
}

export default AddTrackFood;
