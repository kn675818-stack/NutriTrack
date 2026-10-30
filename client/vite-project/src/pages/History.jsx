
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

// Today's date for the HTML date input: YYYY-MM-DD
const getTodayISO = () => {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
};

// Convert YYYY-MM-DD into backend format M/D/YYYY
const formatDateForBackend = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${Number(month)}/${Number(day)}/${year}`;
};

function History() {
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(getTodayISO());
    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!token || !userId) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const backendDate = formatDateForBackend(selectedDate);

                const response = await fetch(
                    `http://localhost:8100/getfoodtrack/${userId}/${encodeURIComponent(backendDate)}`,
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
                    throw new Error("Unable to fetch food history.");
                }

                const data = await response.json();

                setRecords(Array.isArray(data) ? data : []);

            } catch (err) {
                setError(err.message);
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [selectedDate, token, userId, navigate]);

    // Calculate nutrition totals for selected date
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
        <div className="history-page">

            <nav className="history-navbar">
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

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="history-container">

                <div className="history-heading">
                    <h1>Food History</h1>
                    <p>Check your daily food and nutrition records.</p>
                </div>

                <div className="history-date-filter">

                    <label htmlFor="history-date">
                        Select Date
                    </label>

                    <input
                        id="history-date"
                        type="date"
                        value={selectedDate}
                        max={getTodayISO()}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                </div>

                {loading && (
                    <p className="history-status">
                        Loading food history...
                    </p>
                )}

                {error && (
                    <p className="history-error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <section className="history-nutrition">

                            <h2>Nutrition Summary</h2>

                            <div className="history-nutrition-grid">

                                <div className="history-nutrition-card">
                                    <h3>Calories</h3>
                                    <h2>{totals.calories.toFixed(1)}</h2>
                                    <p>kcal</p>
                                </div>

                                <div className="history-nutrition-card">
                                    <h3>Protein</h3>
                                    <h2>{totals.protein.toFixed(1)}g</h2>
                                </div>

                                <div className="history-nutrition-card">
                                    <h3>Carbs</h3>
                                    <h2>{totals.carbs.toFixed(1)}g</h2>
                                </div>

                                <div className="history-nutrition-card">
                                    <h3>Fats</h3>
                                    <h2>{totals.fats.toFixed(1)}g</h2>
                                </div>

                            </div>

                        </section>

                        <section className="history-food-list">

                            <h2>Tracked Foods</h2>

                            {records.length === 0 ? (
                                <p className="history-empty">
                                    No food records found for this date.
                                </p>
                            ) : (
                                <div className="history-records">

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
                                                className="history-food-card"
                                                key={record._id}
                                            >
                                                <div className="history-food-info">

                                                    <h3>{food.name}</h3>

                                                    <p>
                                                        Category: {food.category || "N/A"}
                                                    </p>

                                                    <p>
                                                        Quantity: {record.quantity}{" "}
                                                        {food.servingUnit || "g"}
                                                    </p>

                                                </div>

                                                <div className="history-food-calories">
                                                    <strong>
                                                        {calories.toFixed(1)}
                                                    </strong>
                                                    <span>kcal</span>
                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </section>
                    </>
                )}

                <div className="history-actions">
                    <button onClick={() => navigate("/addtrackfood")}>
                        + Track More Food
                    </button>

                    <button onClick={() => navigate("/dashboard")}>
                        Back to Dashboard
                    </button>
                </div>

            </main>
        </div>
    );
}

export default History;
