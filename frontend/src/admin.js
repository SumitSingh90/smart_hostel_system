import React, { useState, useEffect } from "react";
import "./admin.css";

const API = "http://localhost:5000";

export function Admin({ token }) {
    const [activeSection, setActiveSection] = useState("");

    const [complaints, setComplaints] = useState([]);
    const [cleans, setCleans] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});

    const loadData = React.useCallback(async () => {
        try {
            const cRes = await fetch(`${API}/api/complaints/all`, {
                headers: { Authorization: "Bearer " + token },
            });
            setComplaints(await cRes.json());

            const clRes = await fetch(`${API}/api/cleaning/all`, {
                headers: { Authorization: "Bearer " + token },
            });
            setCleans(await clRes.json());

            const wRes = await fetch(`${API}/api/users`, {
                headers: { Authorization: "Bearer " + token },
            });
            const wJson = await wRes.json();
            setWorkers((wJson.users || []).filter((u) => u.role === "worker"));
        } catch (e) {
            console.error("Load failed", e);
        }
    }, [token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    async function createUser(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/create-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    name: e.target.name.value,
                    email: e.target.email.value,
                    password: e.target.password.value,
                    role: e.target.role.value,
                    roomNo: e.target.roomNo.value,
                }),
            });

            if (!res.ok) return alert("Error creating user");

            alert("User created");
            loadData();
        } catch (err) {
            alert("Network error");
        }
    }

    async function resolveComplaint(id) {
        await fetch(`${API}/api/complaints/${id}/resolve`, {
            method: "PUT",
            headers: { Authorization: "Bearer " + token },
        });

        loadData();
    }

    async function assignWorker(reqId) {
        const workerId = selectedWorker[reqId];
        if (!workerId) return alert("Select a worker");

        await fetch(`${API}/api/cleaning/${reqId}/assign`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ workerId }),
        });

        alert("Assigned");
        loadData();
    }

    // ------------------------------
    // SECTION RENDER FUNCTIONS
    // ------------------------------

    const renderCreateUser = () => (
        <div className="section-card">
            <h3>Create User</h3>
            <form className="form" onSubmit={createUser}>
                <input name="name" placeholder="Name" required />
                <input name="email" placeholder="Email" required />
                <input name="password" placeholder="Password" required />
                <input name="role" placeholder="admin/student/worker" required />
                <input name="roomNo" placeholder="Room No (student only)" />
                <button className="btn-primary">Create User</button>
            </form>
        </div>
    );

    const renderComplaints = () => (
        <div className="section-card">
            <h3>All Complaints</h3>
            {complaints.map((c) => (
                <div key={c._id} className="list-item">
                    <b>{c.category}</b> — {c.description}
                    <br /> Student: {c.student?.name}
                    <br /> Status: {c.status}
                    {c.status !== "resolved" && (
                        <button
                            className="btn-small"
                            onClick={() => resolveComplaint(c._id)}
                        >
                            Mark Resolved
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    const renderCleaning = () => (
        <div className="section-card">
            <h3>Cleaning Requests</h3>
            {cleans.map((cl) => (
                <div key={cl._id} className="list-item">
                    Room: {cl.roomNo} <br />
                    Student: {cl.student?.name} <br />
                    Worker: {cl.assignedWorker?.name || "None"} <br />
                    Preferred: {cl.preferredTime} <br />
                    Status: {cl.status}
                    <br />
                    <select
                        onChange={(e) =>
                            setSelectedWorker({
                                ...selectedWorker,
                                [cl._id]: e.target.value,
                            })
                        }
                    >
                        <option value="">Select Worker</option>
                        {workers.map((w) => (
                            <option value={w._id}>{w.name}</option>
                        ))}
                    </select>
                    <button className="btn-small" onClick={() => assignWorker(cl._id)}>
                        Assign
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="admin-container">

            {/* TOP CARDS (like your screenshot) */}
            <div className="menu-row">
                <div className="menu-card" onClick={() => setActiveSection("create")}>
                    🧑‍💻 Create User
                </div>

                <div className="menu-card" onClick={() => setActiveSection("complaints")}>
                    📝 View Complaints
                </div>

                <div className="menu-card" onClick={() => setActiveSection("cleaning")}>
                    🧹 Cleaning Requests
                </div>
            </div>

            {/* SECTION AREA */}
            <div className="section-area">
                {activeSection === "create" && renderCreateUser()}
                {activeSection === "complaints" && renderComplaints()}
                {activeSection === "cleaning" && renderCleaning()}

                {!activeSection && (
                    <p className="placeholder">Select an option above</p>
                )}
            </div>
        </div>
    );
}
