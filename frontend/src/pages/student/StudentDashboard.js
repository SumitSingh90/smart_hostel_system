import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    assignedTasks: 0
  });

  const [schedule, setSchedule] = useState(null);
  const [menu, setMenu] = useState(null);

  async function loadComplaints() {
    try {
      const res = await api.get("/student/complaints");
      const data = res.data || [];

      const pending = data.filter(c => c.status === "pending").length;
      const assigned = data.filter(c => c.status === "assigned").length;

      setStats({
        totalComplaints: data.length,
        pendingComplaints: pending,
        assignedTasks: assigned
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function loadMenu() {
    try {
      const res = await api.get("/student/menu");
      setMenu(res.data || null);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadSchedule() {
    try {
      const res = await api.get("/student/cleaning-schedule");
      setSchedule(res.data || null);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadComplaints();
    loadMenu();
    loadSchedule();
  }, []);

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      "main",
      { className: "main-content" },

      React.createElement(
        "h1",
        { className: "page-title" },
        "Student Dashboard"
      ),

      /** Stats Section */
      React.createElement(
        "div",
        { className: "stats-container" },

        React.createElement(
          "div",
          { className: "stats-box" },
          React.createElement("h3", null, "Total Complaints"),
          React.createElement("p", null, stats.totalComplaints)
        ),

        React.createElement(
          "div",
          { className: "stats-box" },
          React.createElement("h3", null, "Pending Complaints"),
          React.createElement("p", null, stats.pendingComplaints)
        ),

        React.createElement(
          "div",
          { className: "stats-box" },
          React.createElement("h3", null, "Assigned Tasks"),
          React.createElement("p", null, stats.assignedTasks)
        )
      ),

      /** Cleaning Schedule */
      React.createElement(
        "div",
        { className: "card" },

        React.createElement("h2", null, "Cleaning Schedule"),

        schedule
          ? React.createElement(
              "p",
              null,
              "Every ",
              schedule.day,
              " at ",
              schedule.time
            )
          : React.createElement(
              "p",
              null,
              "No cleaning schedule set."
            )
      ),

      /** Mess Menu */
      React.createElement(
        "div",
        { className: "card" },

        React.createElement("h2", null, "Today's Mess Menu"),

        menu
          ? React.createElement(
              "div",
              null,
              React.createElement(
                "p",
                null,
                React.createElement("strong", null, "Lunch: "),
                menu.lunch ? menu.lunch.join(", ") : "Not updated"
              ),
              React.createElement(
                "p",
                null,
                React.createElement("strong", null, "Dinner: "),
                menu.dinner ? menu.dinner.join(", ") : "Not updated"
              )
            )
          : React.createElement(
              "p",
              null,
              "Menu not available."
            )
      )
    )
  );
}
