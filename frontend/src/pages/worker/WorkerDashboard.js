import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function WorkerDashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const res = await api.get("/worker/tasks");
      const tasks = res.data || [];

      const pending = tasks.filter(t => t.status === "pending").length;
      const completed = tasks.filter(t => t.status === "completed").length;

      setStats({
        totalTasks: tasks.length,
        pendingTasks: pending,
        completedTasks: completed
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      "main",
      { className: "main-content" },

      React.createElement("h1", { className: "page-title" }, "Worker Dashboard"),

      loading
        ? React.createElement("p", null, "Loading stats...")
        : React.createElement(
            "div",
            { className: "stats-container" },

            React.createElement(
              "div",
              { className: "stats-box" },
              React.createElement("h3", null, "Total Tasks"),
              React.createElement("p", null, stats.totalTasks)
            ),

            React.createElement(
              "div",
              { className: "stats-box" },
              React.createElement("h3", null, "Pending Tasks"),
              React.createElement("p", null, stats.pendingTasks)
            ),

            React.createElement(
              "div",
              { className: "stats-box" },
              React.createElement("h3", null, "Completed Tasks"),
              React.createElement("p", null, stats.completedTasks)
            )
          )
    )
  );
}
