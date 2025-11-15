import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function ViewMenu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMenu() {
    try {
      const res = await api.get("/student/menu");
      setMenu(res.data || null);
    } catch (err) {
      console.log(err);
      alert("Failed to load menu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
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
        "Today's Mess Menu"
      ),

      loading
        ? React.createElement("p", null, "Loading menu...")
        : React.createElement(
            "div",
            { className: "card" },

            menu
              ? React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "p",
                    null,
                    React.createElement("strong", null, "Lunch: "),
                    menu.lunch && menu.lunch.length > 0
                      ? menu.lunch.join(", ")
                      : "Not updated"
                  ),

                  React.createElement(
                    "p",
                    null,
                    React.createElement("strong", null, "Dinner: "),
                    menu.dinner && menu.dinner.length > 0
                      ? menu.dinner.join(", ")
                      : "Not updated"
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
