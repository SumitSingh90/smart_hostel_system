import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function AssignWorker() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      // get all complaints
      const res1 = await api.get("/admin/complaints");
      setComplaints(res1.body.data || res1.body || []);

      // get all workers
      const res2 = await api.get("/users?role=worker"); // assuming endpoint
      setWorkers(res2.body.data || res2.body || []);
    } catch (err) {
      alert("Error loading data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function assignWorker(complaintId, workerId) {
    setLoading(true);
    try {
      await api.patch(`/admin/assign-worker/${complaintId}`, { workerId });

      alert("Worker assigned successfully");
      loadData();
    } catch (err) {
      alert(err?.body?.message || "Error assigning worker");
    } finally {
      setLoading(false);
    }
  }

  // UI: complaints list with dropdown workers
  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      "main",
      { className: "main-content" },

      React.createElement("h1", { className: "page-title" }, "Assign Worker"),

      React.createElement(
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
              React.createElement("th", null, "Description"),
              React.createElement("th", null, "Student ID"),
              React.createElement("th", null, "Assign Worker"),
              React.createElement("th", null, "Submit")
            )
          ),

          React.createElement(
            "tbody",
            null,

            complaints.map((complaint) =>
              React.createElement(
                "tr",
                { key: complaint._id },

                React.createElement("td", null, complaint.category),
                React.createElement("td", null, complaint.description),
                React.createElement("td", null, complaint.studentId),

                // worker select
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "select",
                    {
                      onChange: (e) =>
                        setComplaints((prev) =>
                          prev.map((c) =>
                            c._id === complaint._id
                              ? { ...c, selectedWorker: e.target.value }
                              : c
                          )
                        )
                    },
                    React.createElement("option", { value: "" }, "Select Worker"),
                    workers.map((w) =>
                      React.createElement(
                        "option",
                        { value: w.workerId, key: w.workerId },
                        w.name + " (" + w.workerId + ")"
                      )
                    )
                  )
                ),

                // submit button
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "button",
                    {
                      className: "btn",
                      disabled: loading,
                      onClick: () =>
                        assignWorker(complaint._id, complaint.selectedWorker)
                    },
                    loading ? "Assigning..." : "Assign"
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
