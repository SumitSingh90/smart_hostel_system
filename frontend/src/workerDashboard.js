import React, { useState, useEffect } from "react";

const API = "http://localhost:5000";

// -------------------------------------------
// WORKER DASHBOARD
// -------------------------------------------
//rfce-> react fucntioonal component Export
export function Worker({ token }) {
    const [tasks, setTasks] = useState([]);

    const loadData = React.useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/worker/assigned`, {
                headers: { Authorization: "Bearer " + token },
            });
            const data = await res.json();
            setTasks(data || []);
        } catch (err) {
            console.error("Load worker tasks error:", err);
        }
    }, [token]);

    useEffect(() => { loadData(); }, [loadData]);

    async function markDone(id) {
        try {
            await fetch(`${API}/api/cleaning/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
                body: JSON.stringify({ status: "completed" }),
            });
            loadData();
        } catch (err) {
            alert("Error marking done");
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.h2}>Worker Dashboard</h2>

                {tasks.length === 0 && <p>No assigned tasks.</p>}
                {tasks.map(t => (
                    <div key={t._id} style={styles.listItem}>
                        Room: {t.roomNo || t.student?.roomNo || "N/A"} <br />
                        Student: {t.student?.name || t.studentName || "N/A"} <br />
                        Preferred: {t.preferredTime || "Any"} <br />
                        Status: <b>{t.status}</b> <br />
                        {t.status !== "completed" && (
                            <button style={styles.smallBtn} onClick={() => markDone(t._id)}>
                                Mark Complete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// -------------------------------------------
// GLOBAL STYLES
// -------------------------------------------
const styles = {
    page: {
        background: "#fff",
        minHeight: "100vh",
        padding: 40,
        color: "white",
        fontFamily: "Arial",
    },
    h2: {
        color: "black",
    },
    card: {
        maxWidth: 650,
        margin: "auto",
        background: "#ece7e7",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 0 12px rgba(0,0,0,0.3)",
    },
    form: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 25 },
    input: {
        padding: 12,
        borderRadius: 8,
        border: "1px solid #444",
        background: "#3a3a3a",
        color: "white",
    },
    button: {
        padding: 12,
        borderRadius: 8,
        background: "#4e9fff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        color: "black",
    },
    listItem: {
        background: "white",
        color: "black",
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 8px 28px",
        padding: 12,
        margin: "10px 0",
        borderRadius: 8,
    },
    smallBtn: {
        marginTop: 10,
        padding: 8,
        fontSize: 14,
        borderRadius: 6,
        cursor: "pointer",
        background: "#7ad67a",
        border: "none",
    },
};