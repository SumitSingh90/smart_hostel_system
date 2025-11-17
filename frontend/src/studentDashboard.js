import React, { useState, useEffect, useCallback } from "react";
import "./student.css";

const API = "http://localhost:5000";

export function Student({ token, user }) {
    const [activeSection, setActiveSection] = useState("");

    const [complaints, setComplaints] = useState([]);
    const [cleans, setCleans] = useState([]);

    const loadData = useCallback(async () => {
        try {
            const a = await fetch(`${API}/api/student/complaints`, {
                headers: { Authorization: "Bearer " + token },
            });
            setComplaints(await a.json());

            const b = await fetch(`${API}/api/student/cleanRequests`, {
                headers: { Authorization: "Bearer " + token },
            });
            setCleans(await b.json());
        } catch (err) {
            console.error("Load student data error:", err);
        }
    }, [token]);

    useEffect(() => { loadData(); }, [loadData]);

    async function sendComplaint(e) {
        e.preventDefault();
        try {
            await fetch(`${API}/api/complaint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    category: e.target.category.value,
                    description: e.target.description.value,
                }),
            });
            alert("Complaint submitted");
            loadData();
        } catch {
            alert("Error submitting complaint");
        }
    }

    async function sendCleaning(e) {
        e.preventDefault();
        try {
            await fetch(`${API}/api/clean`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    roomNo: user.roomNo,
                    preferredTime: e.target.preferredTime.value,
                }),
            });
            alert("Cleaning request submitted");
            loadData();
        } catch {
            alert("Error submitting cleaning request");
        }
    }

    // -----------------------------
    // Render Sections
    // -----------------------------

    const SubmitComplaint = () => (
        <div className="section-card">
            <h2 className="section-title">Submit Complaint</h2>
            <form className="form" onSubmit={sendComplaint}>
                <input name="category" placeholder="Complaint Category" className="input" required />
                <input name="description" placeholder="Complaint Description" className="input" required />
                <button className="button">Submit Complaint</button>
            </form>
        </div>
    );

    const CleaningRequest = () => (
        <div className="section-card">
            <h2 className="section-title">Request Room Cleaning</h2>
            <form className="form" onSubmit={sendCleaning}>
                <input name="preferredTime" placeholder="Preferred Time" className="input" required />
                <button className="button green">Request Cleaning</button>
            </form>
        </div>
    );

    const ViewComplaints = () => (
        <div className="section-card">
            <h2 className="section-title">Your Complaints</h2>
            {complaints.length === 0 && <p className="empty">No complaints yet.</p>}

            {complaints.map((c) => (
                <div className="list-item" key={c._id}>
                    <p><b>{c.category}</b> — {c.description}</p>
                    <p className="status">Status: <span>{c.status}</span></p>
                </div>
            ))}
        </div>
    );

    const ViewCleaningRequests = () => (
        <div className="section-card">
            <h2 className="section-title">Your Cleaning Requests</h2>
            {cleans.length === 0 && <p className="empty">No cleaning requests yet.</p>}

            {cleans.map((c) => (
                <div className="list-item" key={c._id}>
                    <p>Room: {c.roomNo}</p>
                    <p>Time: {c.preferredTime}</p>
                    <p className="status">Status: <span>{c.status}</span></p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="student-page">

            {/* MENU */}
            <div className="menu-row">
                <div className="menu-card" onClick={() => setActiveSection("submit")}>
                    📝 Submit Complaint
                </div>

                <div className="menu-card" onClick={() => setActiveSection("clean")}>
                    🧹 Cleaning Request
                </div>

                <div className="menu-card" onClick={() => setActiveSection("viewComplaints")}>
                    📄 View Complaints
                </div>

                <div className="menu-card" onClick={() => setActiveSection("viewCleaning")}>
                    🧼 View Cleaning Requests
                </div>
            </div>

            {/* CONTENT */}
            <div className="section-area">
                {activeSection === "submit" && <SubmitComplaint />}
                {activeSection === "clean" && <CleaningRequest />}
                {activeSection === "viewComplaints" && <ViewComplaints />}
                {activeSection === "viewCleaning" && <ViewCleaningRequests />}

                {!activeSection && <p className="placeholder">Select an option above</p>}
            </div>
        </div>
    );
}
