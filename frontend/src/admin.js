import React, { useState, useEffect } from "react";
import "./admin.css";
import LogoutButton from "./logout";
const API = "http://localhost:5000";

export function Admin({ token }) {
    const [activeSection, setActiveSection] = useState("");

    const [complaints, setComplaints] = useState([]);
    const [cleans, setCleans] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [students, setStudents] = useState([]);
    const [allWorkers, setAllWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [roomStats, setRoomStats] = useState(null);

    const loadData = React.useCallback(async () => {
        try {
            // Complaints
            const cRes = await fetch(`${API}/api/complaints/all`, {
                headers: { Authorization: "Bearer " + token },
            });
            setComplaints(await cRes.json());

            // Cleaning
            const clRes = await fetch(`${API}/api/cleaning/all`, {
                headers: { Authorization: "Bearer " + token },
            });
            setCleans(await clRes.json());

            // Users
            const uRes = await fetch(`${API}/api/users`, {
                headers: { Authorization: "Bearer " + token },
            });
            const uJson = await uRes.json();
            const allUsers = uJson.users || [];

            setStudents(allUsers.filter((u) => u.role === "student"));
            setAllWorkers(allUsers.filter((u) => u.role === "worker"));
            setWorkers(allUsers.filter((u) => u.role === "worker"));

            // NEW: Room Status Analytics
            const roomRes = await fetch(`${API}/api/dashboard/room-status`, {
                headers: { Authorization: "Bearer " + token },
            });
            setRoomStats(await roomRes.json());
        } catch (e) {
            console.error("Load failed", e);
        }
    }, [token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    async function createUser(e) {
        e.preventDefault();

        if (e.target.contact.value.length !== 10) {
            return alert("Contact number should be exactly 10 digits");
        }

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
                    contact: e.target.contact.value,
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

    // -------------------------- SEARCH LOGIC --------------------------
    const filteredStudents = students.filter((s) =>
        `${s.name} ${s.email} ${s.roomNo || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const filteredWorkers = allWorkers.filter((w) =>
        `${w.name} ${w.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // -------------------------- SECTION UI --------------------------

    const renderCreateUser = () => (
        <div className="section-card">
            <h3>Create User</h3>
            <form className="form" onSubmit={createUser}>
                <input name="name" placeholder="Name" required />
                <input name="email" placeholder="Email" required />
                <input name="contact" placeholder="Phone" required />
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
                            <option key={w._id} value={w._id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                    <button className="btn-small" onClick={() => assignWorker(cl._id)}>
                        Assign
                    </button>
                </div>
            ))}
        </div>
    );

    const renderDetails = () => (
        <div className="section-card">
            <h3>All Details</h3>

            <input
                type="text"
                placeholder="Search by name, email, room..."
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: "15px", width: "100%" }}
            />

            <h3>Student Details ({filteredStudents.length}) </h3>
            {filteredStudents.length === 0 && <p>No students found</p>}

            {filteredStudents.map((s) => (
                <div key={s._id} className="list-item">
                    <b>{s.name}</b> <br />
                    Email: {s.email} <br />
                    Room No: {s.roomNo || "Not assigned"} <br />
                    Role: {s.role} <br />
                    Contact: {s.contact}
                </div>
            ))}

            <hr style={{ margin: "20px 0" }} />

            <h3>Worker Details ({filteredWorkers.length})</h3>
            {filteredWorkers.length === 0 && <p>No workers found</p>}

            {filteredWorkers.map((w) => (
                <div key={w._id} className="list-item">
                    <b>{w.name}</b> <br />
                    Email: {w.email} <br />
                    Role: {w.role} <br />
                    Contact: {w.contact}
                </div>
            ))}
        </div>
    );

    // -------------------------- NEW ROOM STATS SECTION --------------------------

    const renderRoomStats = () => {
        if (!roomStats) return <p>Loading...</p>;

        return (
            <div className="section-card">
                <h3>Room Cleaning Summary</h3>

                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <div className="stat-box"><b>Total Rooms</b><br />{roomStats.totalRooms}</div>
                    <div className="stat-box"><b>Cleaned</b><br />{roomStats.cleaned}</div>
                    <div className="stat-box"><b>Pending</b><br />{roomStats.pending}</div>
                    <div className="stat-box"><b>Not Requested</b><br />{roomStats.notRequested}</div>
                </div>

                <h3>Room Status List</h3>

                {roomStats.rooms.map((room) => (
                    <div key={room.roomNo} className="list-item">
                        <b>Room {room.roomNo}</b> <br />
                        Student: {room.student} <br />
                        Status:
                        {room.status === "completed" && (
                            <span style={{ color: "green", fontWeight: "bold" }}> ✔ Cleaned</span>
                        )}
                        {room.status === "pending" && (
                            <span style={{ color: "orange", fontWeight: "bold" }}> ⏳ Pending</span>
                        )}
                        {room.status === "Not Requested" && (
                            <span style={{ color: "red", fontWeight: "bold" }}> ❌ Not Requested</span>
                        )}
                        <br />
                        Last Update: {room.lastRequestDate ? new Date(room.lastRequestDate).toLocaleString() : "—"}
                    </div>
                ))}
            </div>
        );
    };

    // -------------------------- MAIN UI --------------------------
    return (
        <div className="admin-container">
            <LogoutButton />
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

                <div className="menu-card" onClick={() => setActiveSection("details")}>
                    📚 Details
                </div>

                {/* NEW BUTTON */}
                <div className="menu-card" onClick={() => setActiveSection("roomStats")}>
                    📊 Room Status
                </div>
            </div>

            <div className="section-area">
                {activeSection === "create" && renderCreateUser()}
                {activeSection === "complaints" && renderComplaints()}
                {activeSection === "cleaning" && renderCleaning()}
                {activeSection === "details" && renderDetails()}
                {activeSection === "roomStats" && renderRoomStats()}

                {!activeSection && <p className="placeholder">Select an option above</p>}
            </div>
        </div>
    );
}
