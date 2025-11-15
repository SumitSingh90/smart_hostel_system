import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function AddMenu() {
  const [form, setForm] = useState({
    date: "",
    mealType: "",
    items: ""
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
      const payload = {
        date: form.date,
        mealType: form.mealType,
        items: form.items.split(",").map(i => i.trim())
      };

      await api.post("/worker/menu", payload);

      alert("Menu added successfully!");

      setForm({ date: "", mealType: "", items: "" });
    } catch (err) {
      console.log(err);
      alert("Failed to add menu");
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
        "Add Mess Menu"
      ),

      React.createElement(
        "div",
        { className: "card" },

        React.createElement(
          "form",
          { onSubmit: handleSubmit },

          /** Date */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Date:"),
            React.createElement("input", {
              type: "date",
              name: "date",
              value: form.date,
              onChange: handleChange,
              required: true
            })
          ),

          /** Meal Type */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Meal Type:"),
            React.createElement(
              "select",
              {
                name: "mealType",
                value: form.mealType,
                onChange: handleChange,
                required: true
              },
              React.createElement("option", { value: "" }, "Select meal"),
              React.createElement("option", { value: "lunch" }, "Lunch"),
              React.createElement("option", { value: "dinner" }, "Dinner")
            )
          ),

          /** Menu Items */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Items (comma-separated):"),
            React.createElement("input", {
              type: "text",
              name: "items",
              placeholder: "e.g. Rice, Dal, Roti",
              value: form.items,
              onChange: handleChange,
              required: true
            })
          ),

          /** Submit Button */
          React.createElement(
            "button",
            {
              type: "submit",
              className: "btn",
              disabled: loading
            },
            loading ? "Adding..." : "Add Menu"
          )
        )
      )
    )
  );
}
