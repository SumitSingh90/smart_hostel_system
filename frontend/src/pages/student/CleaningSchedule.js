import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function CleaningSchedule() {
  const [schedule, setSchedule] = useState({
    day: "",
    time: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/student/cleaning-schedule", schedule);
    alert("Cleaning schedule updated!");
  } catch (err) {
    console.log(err);
    alert("Failed to set schedule");
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
        "Set Cleaning Schedule"
      ),

      React.createElement(
        "div",
        { className: "card" },

        React.createElement(
          "form",
          { onSubmit: handleSubmit },

          /* Day selection */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Day:"),
            React.createElement(
              "select",
              {
                name: "day",
                value: schedule.day,
                onChange: handleChange,
                required: true
              },
              React.createElement("option", { value: "" }, "Select a day"),
              React.createElement("option", { value: "Monday" }, "Monday"),
              React.createElement("option", { value: "Tuesday" }, "Tuesday"),
              React.createElement("option", { value: "Wednesday" }, "Wednesday"),
              React.createElement("option", { value: "Thursday" }, "Thursday"),
              React.createElement("option", { value: "Friday" }, "Friday"),
              React.createElement("option", { value: "Saturday" }, "Saturday"),
              React.createElement("option", { value: "Sunday" }, "Sunday")
            )
          ),

          /* Time input */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Time:"),
            React.createElement("input", {
              type: "time",
              name: "time",
              value: schedule.time,
              onChange: handleChange,
              required: true
            })
          ),

          /* Submit btn */
          React.createElement(
            "button",
            {
              type: "submit",
              className: "btn",
              disabled: loading
            },
            loading ? "Saving..." : "Save Schedule"
          )
        )
      )
    )
  );
}
