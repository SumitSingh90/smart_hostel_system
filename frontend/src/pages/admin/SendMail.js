import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function SendMail() {
  const [mailData, setMailData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setMailData({
      ...mailData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/admin/send-mail", mailData); // removed 'const res ='
    alert("Mail sent successfully!");
  } catch (err) {
    console.log(err);
    alert("Failed to send email");
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

      React.createElement("h1", { className: "page-title" }, "Send Email"),

      React.createElement(
        "div",
        { className: "card" },

        React.createElement(
          "form",
          { onSubmit: handleSubmit },

          /* Email field */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Send To (Email):"),
            React.createElement("input", {
              type: "email",
              name: "to",
              value: mailData.to,
              onChange: handleChange,
              required: true,
              placeholder: "worker@gmail.com or student@gmail.com"
            })
          ),

          /* Subject field */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Subject:"),
            React.createElement("input", {
              type: "text",
              name: "subject",
              value: mailData.subject,
              onChange: handleChange,
              required: true,
              placeholder: "Email subject here..."
            })
          ),

          /* Message field */
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("label", null, "Message:"),
            React.createElement("textarea", {
              name: "message",
              rows: 5,
              value: mailData.message,
              onChange: handleChange,
              required: true,
              placeholder: "Write your message..."
            })
          ),

          /* Button */
          React.createElement(
            "button",
            { type: "submit", className: "btn", disabled: loading },
            loading ? "Sending..." : "Send Email"
          )
        )
      )
    )
  );
}
