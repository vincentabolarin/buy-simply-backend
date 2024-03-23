const LoanServices = require('../services/LoanServices');

async function FetchAllLoans(req, res) {
  try {
    const token = req.headers.authorization;
    const currentUser = req.session.user

    const { status } = req.query;

    const result = await LoanServices.FetchAllLoans(token, currentUser, status);

    if (result.message === "Unauthorized") {
      return res.status(401).send(result);
    }
    
    if (!result.success) {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

async function FetchLoansByEmail(req, res) {
  try {
    const token = req.headers.authorization;

    const currentUser = req.session.user

    const { email } = req.params;

    const { status } = req.query;

    const result = await LoanServices.FetchLoansByEmail(token, currentUser, email, status);

    if (result.message === "Unauthorized") {
      return res.status(401).send(result);
    }
    
    if (!result.success) {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

async function FetchExpiredLoans(req, res) {
  try {
    const token = req.headers.authorization;

    const currentUser = req.session.user

    const { status } = req.query;

    const result = await LoanServices.FetchExpiredLoans(token, currentUser, status);

    if (result.message === "Unauthorized") {
      return res.status(401).send(result);
    }
    
    if (!result.success) {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

async function DeleteLoanById(req, res) {
  try {
    const token = req.headers.authorization;

    const currentUser = req.session.user

    const { loanId } = req.params;

    const result = await LoanServices.DeleteLoanById(token, currentUser, loanId);

    if (
      result.message === "Unauthorized" ||
      result.message === "You must be logged in to delete a loan." ||
      result.message === "You do not have permission to delete a loan."
    ) {
      return res.status(401).send(result);
    }
    
    if (!result.success) {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  FetchAllLoans,
  FetchLoansByEmail,
  FetchExpiredLoans,
  DeleteLoanById
}