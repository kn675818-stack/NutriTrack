import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Foods from "./pages/Foods";
import History from "./pages/History";
import AddTrackFood from "./pages/AddTrackFood";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/history" element={<History />} />
            <Route path="/addtrackfood" element={<AddTrackFood />} />
        </Routes>
    );
}

export default App;