import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadComplaints() {
    try {
      const res = await api.get("/admin/complaints");
      setComplaints(res.body.data || res.body || []);
    } catch (err) {
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      "main",
      { className: "main-content" },

      React.createElement("h1", { className: "page-title" }, "All Complaints"),

      React.createElement(
        "div",
        { className: "card" },

        loading
          ? React.createElement("p", null, "Loading complaints...")
          : React.createElement(
              "table",
              { className: "table" },

              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement("th", null, "Category"),
                  React.createElement("th", null, "Description"),
                  React.createElement("th", null, "Student ID"),
                  React.createElement("th", null, "Status"),
                  React.createElement("th", null, "Worker Assigned")
                )
              ),

              React.createElement(
                "tbody",
                null,
                complaints.length === 0
                  ? React.createElement(
                      "tr",
                      null,
                      React.createElement(
                        "td",
                        { colSpan: 5, style: { textAlign: "center" } },
                        "No complaints found"
                      )
                    )
                  : complaints.map((c) =>
                      React.createElement(
                        "tr",
                        { key: c._id },

                        React.createElement("td", null, c.category),
                        React.createElement("td", null, c.description),
                        React.createElement("td", null, c.studentId),
                        React.createElement("td", null, c.status || "Pending"),
                        React.createElement(
                          "td",
                          null,
                          c.assignedWorker
                            ? c.assignedWorker.name +
                                " (" +
                                c.assignedWorker.workerId +
                                ")"
                            : "Not Assigned"
                        )
                      )
                    )
              )
            )
      )
    )
  );
}
