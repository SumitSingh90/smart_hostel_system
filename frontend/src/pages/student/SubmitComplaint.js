import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function SubmitComplaint() {
  const [form, setForm] = useState({
    category: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/student/complaint", form); // no 'res'
    alert("Complaint submitted successfully!");
    setForm({ category: "", description: "" });
  } catch (err) {
    console.log(err);
    alert("Failed to submit complaint.");
  } finally {
    setLoading(false);
  }
}


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
        "Submit Complaint"
      ),

      React.createElement(
        "div",
        { className: "card" },

        React.createElement(
          "form",
          { onSubmit: handleSubmit },

          /** Category select */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Complaint Category:"),
            React.createElement(
              "select",
              {
                name: "category",
                value: form.category,
                onChange: handleChange,
                required: true
              },
              React.createElement("option", { value: "" }, "Select category"),
              React.createElement("option", { value: "food" }, "Food"),
              React.createElement("option", { value: "cleaning" }, "Cleaning"),
              React.createElement("option", { value: "discipline" }, "Discipline")
            )
          ),

          /** Description */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Description:"),
            React.createElement("textarea", {
              name: "description",
              value: form.description,
              onChange: handleChange,
              placeholder: "Write your complaint here...",
              rows: 4,
              required: true
            })
          ),

          /** Submit button */
          React.createElement(
            "button",
            {
              type: "submit",
              className: "btn",
              disabled: loading
            },
            loading ? "Submitting..." : "Submit Complaint"
          )
        )
      )
    )
  );
}
