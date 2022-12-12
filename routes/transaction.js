import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
const { transactionController } = controllers;

router.route("/")
.get(transactionController.getTransactions)

router.route("/:id")
.get(transactionController.getTransaction)

export default router;
