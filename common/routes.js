const express = require('express');
const router = express.Router();
const auth = require('../modules/auth/auth_controller');
const user = require('../modules/user/user_controller');
const order = require('../modules/order/order_controller');
const dashboard = require('../modules/dashboard/dashboard_controller');

// Auth
router.get("/login", (req, res) => {
  auth.login(req, res);
});
router.post("/process_login", async (req, res) => {
  auth.processLogin(req, res);
});
router.get("/logout", (req, res) => {
  auth.logout(req, res);
});
router.post("/process_change_password", async (req, res) => {
  auth.changePassword(req, res);
});

// Dashboard
router.get("/dashboard", async (req, res) => {
  dashboard.index(req, res);
});

// User management
router.post("/users/create", async (req, res) => {
  user.create(req, res);
});
router.get("/users/:id/edit", async (req, res) => {
  user.edit(req, res);
});
router.post("/users/:id/update", async (req, res) => {
  user.update(req, res);
});
router.post("/users/:id/delete", async (req, res) => {
  user.delete(req, res);
});

// Order management
router.post("/orders/:id/update-status", async (req, res) => {
  order.updateStatus(req, res);
});

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;
