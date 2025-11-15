import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function fetchTasks() {
    try {
      const res = await api.get("/worker/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function markDone(id) {
    setUpdating(true);
    try {
      await api.patch(`/worker/mark-done/${id}`);
      alert("Task marked completed");
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Failed to update task");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      "main",
      { className: "main-content" },

      React.createElement("h1", { className: "page-title" }, "My Tasks"),

      loading
        ? React.createElement("p", null, "Loading tasks...")
        : tasks.length === 0
        ? React.createElement("p", null, "No tasks assigned.")
        : React.createElement(
            "div",
            { className: "card" },

            React.createElement(
              "table",
              { className: "table" },

              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement("th", null, "Category"),
                  React.createElement("th", null, "Student"),
                  React.createElement("th", null, "Status"),
                  React.createElement("th", null, "Action")
                )
              ),

              React.createElement(
                "tbody",
                null,
                tasks.map((task) =>
                  React.createElement(
                    "tr",
                    { key: task.complaintId },

                    React.createElement("td", null, task.category),
                    React.createElement("td", null, task.student),
                    React.createElement("td", null, task.status),

                    React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "button",
                        {
                          className: "btn",
                          disabled: updating || task.status === "completed",
                          onClick: () => markDone(task.complaintId)
                        },
                        updating
                          ? "Updating..."
                          : task.status === "completed"
                          ? "Done"
                          : "Mark Done"
                      )
                    )
                  )
                )
              )
            )
          )
    )
  );
}

