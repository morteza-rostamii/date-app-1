import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home/index", {
    title: "My Express Handlebars Page",
    username: "Morteza",
    items: ["Learn JavaScript", "Master React", "Build Cool Stuff"],
    users: [
      {
        id: 1,
        username: "morteza",
        address: { city: "Tehran" },
        role: "admin",
      },
      { id: 2, username: "ali", address: { city: "Tehran2" }, role: "user" },
      { id: 3, username: "hasan", address: { city: "Tehran3" }, role: "user" },
    ],
    isHome: true,
  });
});

export default router;
