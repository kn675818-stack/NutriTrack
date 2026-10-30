
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Foods.css";

function Foods() {
    const navigate = useNavigate();

    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Fetch foods from backend
    useEffect(() => {
        if (!token || !userId) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchFoods = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8100/getfoods",
                    {
                        method: "GET",
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
                    throw new Error("Unable to fetch foods");
                }

                const data = await response.json();

                setFoods(Array.isArray(data) ? data : []);

            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, [token, userId, navigate]);

    // Get available food categories
    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(foods.map((food) => food.category).filter(Boolean))
        ];

        return ["All", ...uniqueCategories];
    }, [foods]);

    // Search and filter foods
    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchesSearch = food.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                food.category === selectedCategory;

            const matchesType =
                selectedType === "All" ||
                food.foodType === selectedType;

            return matchesSearch && matchesCategory && matchesType;
        });
    }, [foods, search, selectedCategory, selectedType]);

    // Navigate to Add Track Food page
    const handleTrackFood = () => {
        navigate("/addtrackfood");
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        navigate("/login", { replace: true });
    };

    return (
        <div className="foods-page">

            {/* Navbar */}
            <nav className="foods-navbar">

                <h2 className="foods-logo">
                    NutriTrack
                </h2>

                <div className="foods-nav-links">

                    <button onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>

                    <button onClick={() => navigate("/foods")}>
                        Foods
                    </button>

                    <button onClick={() => navigate("/history")}>
                        History
                    </button>

                    <button
                        className="foods-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* Main Content */}
            <main className="foods-container">

                <div className="foods-heading">

                    <div>
                        <h1>Explore Foods</h1>

                        <p>
                            Discover foods and track your daily nutrition.
                        </p>
                    </div>

                    <button
                        className="track-food-main-btn"
                        onClick={handleTrackFood}
                    >
                        + Track Food
                    </button>

                </div>

                {/* Search */}
                <div className="foods-search-section">

                    <input
                        type="text"
                        placeholder="Search food by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                {/* Food Type Filter */}
                <div className="foods-filter-section">

                    <div className="filter-group">

                        <label>Food Type</label>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Veg">Vegetarian</option>
                            <option value="Non-Veg">Non-Vegetarian</option>
                        </select>

                    </div>

                    <div className="filter-group">

                        <label>Category</label>

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

                {/* Loading */}
                {loading && (
                    <p className="foods-status">
                        Loading foods...
                    </p>
                )}

                {/* Error */}
                {!loading && error && (
                    <p className="foods-error">
                        {error}
                    </p>
                )}

                {/* Empty Result */}
                {!loading && !error && filteredFoods.length === 0 && (
                    <div className="foods-empty">
                        <h3>No foods found</h3>
                        <p>Try another search or change your filters.</p>
                    </div>
                )}

                {/* Food Cards */}
                {!loading && !error && filteredFoods.length > 0 && (

                    <div className="foods-grid">

                        {filteredFoods.map((food) => (

                            <div className="food-card" key={food._id}>

                                {/* Food Image */}
                                <div className="food-image-container">

                                    {food.image ? (
                                        <img
                                            src={food.image}
                                            alt={food.name}
                                            className="food-image"
                                        />
                                    ) : (
                                        <div className="food-no-image">
                                            No Image
                                        </div>
                                    )}

                                </div>

                                {/* Food Information */}
                                <div className="food-card-content">

                                    <div className="food-title-row">

                                        <h3>{food.name}</h3>

                                        <span
                                            className={
                                                food.foodType === "Veg"
                                                    ? "veg-badge"
                                                    : "nonveg-badge"
                                            }
                                        >
                                            {food.foodType || "Food"}
                                        </span>

                                    </div>

                                    <p className="food-category">
                                        {food.category}
                                    </p>

                                    <p className="food-serving">
                                        Serving: {food.servingSize || 100}
                                        {" "}
                                        {food.servingUnit || "g"}
                                    </p>

                                    {/* Calories */}
                                    <div className="food-calories">
                                        <h2>
                                            {food.calories || 0}
                                        </h2>
                                        <span>Calories</span>
                                    </div>

                                    {/* Nutrition Information */}
                                    <div className="food-nutrition">

                                        <div>
                                            <strong>
                                                {food.protein || 0}g
                                            </strong>
                                            <span>Protein</span>
                                        </div>

                                        <div>
                                            <strong>
                                                {food.carbs || 0}g
                                            </strong>
                                            <span>Carbs</span>
                                        </div>

                                        <div>
                                            <strong>
                                                {food.fats || 0}g
                                            </strong>
                                            <span>Fat</span>
                                        </div>

                                        <div>
                                            <strong>
                                                {food.fiber || 0}g
                                            </strong>
                                            <span>Fiber</span>
                                        </div>

                                    </div>

                                    {/* Track Button */}
                                    <button
                                        className="food-track-btn"
                                        onClick={handleTrackFood}
                                    >
                                        Track This Food
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Foods;
