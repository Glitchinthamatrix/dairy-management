import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Transaction } = models;

async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(generalizeResult(transactions));
  } catch (e) {
    res.status(500).json({});
  }
}

async function getTransaction(req, res) {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.TransactionId });
    res.status(200).json(generalizeResult(transaction));
  } catch (e) {
    res.status(500).json({});
  }
}

export default { getTransactions, getTransaction };
