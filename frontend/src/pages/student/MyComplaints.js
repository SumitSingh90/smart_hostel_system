import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchComplaints() {
    try {
      const res = await api.get("/student/complaints");
      setComplaints(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      "main",
      { className: "main-content" },

      React.createElement("h1", { className: "page-title" }, "My Complaints"),

      loading
        ? React.createElement("p", null, "Loading...")
        : complaints.length === 0
        ? React.createElement("p", null, "No complaints found.")
        : React.createElement(
            "div",
            { className: "card" },

            React.createElement(
              "table",
              { className: "table" },

              /* Table head */
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement("th", null, "Category"),
                  React.createElement("th", null, "Description"),
                  React.createElement("th", null, "Status"),
                  React.createElement("th", null, "Worker")
                )
              ),

              /* Table body */
              React.createElement(
                "tbody",
                null,

                complaints.map(function (item, index) {
                  return React.createElement(
                    "tr",
                    { key: index },

                    React.createElement("td", null, item.category),
                    React.createElement("td", null, item.description),
                    React.createElement("td", null, item.status),
                    React.createElement(
                      "td",
                      null,
                      item.worker ? item.worker.name : "Not Assigned"
                    )
                  );
                })
              )
            )
          )
    )
  );
}
