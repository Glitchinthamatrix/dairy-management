import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Transaction } = models;

function getTransactions(req, res) {
  Transaction.find()
    .then((transactions) => {
      res.status(200).json(generalizeResult(transactions));
    })
    .catch((e) => {
      res.status(500).json({});
    });
}

function getTransaction(req, res) {
  Transaction.findById(req.params.transactionId)
    .then((transaction) => {
      res.status(200).json(generalizeResult(transaction));
    })
    .catch((e) => {
      res.status(500).json({});
    });
}

export default { getTransactions, getTransaction };
