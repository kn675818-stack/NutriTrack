
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// Get today's date in the backend's M/D/YYYY format
const getTodayBackendDate = () => {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
};

function Dashboard() {
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!token || !userId) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchTodayFood = async () => {
            try {
                setLoading(true);
                setError("");

                const today = getTodayBackendDate();

                const response = await fetch(
                    `http://localhost:8100/getfoodtrack/${userId}/${encodeURIComponent(today)}`,
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
                    throw new Error("Unable to fetch today's food records.");
                }

                const data = await response.json();

                setRecords(Array.isArray(data) ? data : []);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayFood();
    }, [token, userId, navigate]);

    // Calculate nutrition totals
    const totals = records.reduce(
        (result, record) => {
            const food = record.foodId;

            if (!food || typeof food !== "object") {
                return result;
            }

            const servingSize = Number(food.servingSize) || 100;
            const quantity = Number(record.quantity) || 0;
            const multiplier = quantity / servingSize;

            result.calories += (Number(food.calories) || 0) * multiplier;
            result.protein += (Number(food.protein) || 0) * multiplier;
            result.carbs += (Number(food.carbs) || 0) * multiplier;
            result.fats += (Number(food.fats) || 0) * multiplier;

            return result;
        },
        {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
        }
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login", { replace: true });
    };

    return (
        <div className="dashboard-page">

            <nav className="dashboard-navbar">
                <h2>NutriTrack</h2>

                <div className="dashboard-nav-links">
                    <button onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>

                    <button onClick={() => navigate("/foods")}>
                        Foods
                    </button>

                    <button onClick={() => navigate("/history")}>
                        History
                    </button>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">

                <div className="dashboard-heading">
                    <h1>Nutrition Dashboard</h1>
                    <p>Here is your nutrition summary for today.</p>
                </div>

                {loading && (
                    <p className="dashboard-status">
                        Loading your nutrition...
                    </p>
                )}

                {error && (
                    <p className="dashboard-error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <div className="nutrition-grid">

                            <div className="nutrition-card">
                                <h3>Calories</h3>
                                <h2>{totals.calories.toFixed(1)}</h2>
                                <p>kcal</p>
                            </div>

                            <div className="nutrition-card">
                                <h3>Protein</h3>
                                <h2>{totals.protein.toFixed(1)}</h2>
                                <p>grams</p>
                            </div>

                            <div className="nutrition-card">
                                <h3>Carbohydrates</h3>
                                <h2>{totals.carbs.toFixed(1)}</h2>
                                <p>grams</p>
                            </div>

                            <div className="nutrition-card">
                                <h3>Fats</h3>
                                <h2>{totals.fats.toFixed(1)}</h2>
                                <p>grams</p>
                            </div>

                        </div>

                        <section className="history-section">

                            <div className="section-heading">
                                <h2>Today's Food</h2>

                                <button onClick={() => navigate("/history")}>
                                    View History
                                </button>
                            </div>

                            {records.length === 0 ? (
                                <p className="empty-message">
                                    No food tracked today. Start by adding food!
                                </p>
                            ) : (
                                <div className="dashboard-food-list">

                                    {records.map((record) => {
                                        const food = record.foodId;

                                        if (!food || typeof food !== "object") {
                                            return null;
                                        }

                                        const servingSize =
                                            Number(food.servingSize) || 100;

                                        const multiplier =
                                            Number(record.quantity) / servingSize;

                                        const calories =
                                            (Number(food.calories) || 0) * multiplier;

                                        return (
                                            <div
                                                className="dashboard-food-item"
                                                key={record._id}
                                            >
                                                <div>
                                                    <h3>{food.name}</h3>
                                                    <p>
                                                        Quantity: {record.quantity}{" "}
                                                        {food.servingUnit || "g"}
                                                    </p>
                                                </div>

                                                <strong>
                                                    {calories.toFixed(1)} kcal
                                                </strong>
                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </section>
                    </>
                )}

                <div className="dashboard-actions">
                    <button onClick={() => navigate("/foods")}>
                        Explore Foods
                    </button>

                    <button onClick={() => navigate("/addtrackfood")}>
                        + Track Food
                    </button>
                </div>

            </main>
        </div>
    );
}

export default Dashboard;
