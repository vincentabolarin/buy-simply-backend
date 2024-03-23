const router = require("express").Router();
const { FetchAllLoans, FetchLoansByEmail, FetchExpiredLoans, DeleteLoanById } = require("../controllers/LoanControllers");

router.get("/", FetchAllLoans);
router.get("/:email/get", FetchLoansByEmail);
router.get("/expired", FetchExpiredLoans);
router.get("/:loanId/delete", DeleteLoanById);

module.exports = router;