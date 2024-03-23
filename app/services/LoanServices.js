const jwt = require("jsonwebtoken");

const jwtToken = process.env.JWT_SECRET_KEY;

const loanData = require("../data/loans.json");

async function FetchAllLoans(token, currentUser, status) {
  try {
    const loans = status ? loanData.filter(loan => status === loan.status) : loanData;
    
    const loansWithoutTotal = loans.map(
      ({ id, amount, maturityDate, status, applicant, createdAt }) => {
        const { totalLoan, ...restData } = applicant;
        return {
          id,
          amount,
          maturityDate,
          status,
          createdAt,
          applicant: restData,
        };
      }
    );

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to fetch loans data.",
      }
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtToken, (err, decoded) => {
        if (err) {
          resolve({
            success: false,
            message: "Unauthorized",
          });
        }

        if (
          decoded.id === currentUser.id &&
          decoded.email === currentUser.email
        ) {
          if (!loans) {
            resolve({
              success: false,
              message: "Error fetching loans.",
            });
          }

          if (loans.length === 0) {
            resolve({
              success: true,
              message: "There are no loans at the moment.",
              count: loans.length,
              data:
                decoded.role !== "admin" && decoded.role !== "superAdmin"
                  ? loansWithoutTotal
                  : loans,
            });
          }

          resolve({
            success: true,
            message: "Loans fetched successfully.",
            count: loans.length,
            data:
              decoded.role !== "admin" && decoded.role !== "superAdmin"
                ? loansWithoutTotal
                : loans,
          });
        } else {
          resolve({
            success: false,
            message: "Session token is invalid.",
          });
        }
      })
    });
  } catch (error) {
    return {
      success: false,
      message: "Error fetching loans.",
      data: error
    }
  }
}

async function FetchLoansByEmail(token, currentUser, email, status) {
  try {
    const loans = status
      ? loanData.filter((loan) => status === loan.status)
      : loanData;
    
    const filteredLoans = loans.filter((loan) => email === loan.applicant.email);

    const loansWithoutTotal = filteredLoans.map(
      ({ id, amount, maturityDate, status, applicant, createdAt }) => {
        const { totalLoan, ...restData } = applicant;
        return {
          id,
          amount,
          maturityDate,
          status,
          createdAt,
          applicant: restData,
        };
      }
    );

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to fetch this user's loan data.",
      };
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtToken, (err, decoded) => {
        if (err) {
          resolve({
            success: false,
            message: "Unauthorized",
          });
        }

        if (
          decoded.id === currentUser.id &&
          decoded.email === currentUser.email
        ) {
          if (!filteredLoans) {
            resolve({
              success: false,
              message: "Error fetching loans.",
            });
          }

          if (filteredLoans.length === 0) {
            resolve({
              success: true,
              message: "This user has no loan at the moment.",
              count: filteredLoans.length,
              data:
                decoded.role !== "admin" && decoded.role !== "superAdmin"
                  ? loansWithoutTotal
                  : filteredLoans,
            });
          }

          resolve({
            success: true,
            message: "User's loans fetched successfully.",
            count: filteredLoans.length,
            data:
              decoded.role !== "admin" && decoded.role !== "superAdmin"
                ? loansWithoutTotal
                : filteredLoans,
          });
        } else {
          resolve({
            success: false,
            message: "Session token is invalid.",
          });
        }
      });
    });
  } catch (error) {
    return {
      success: false,
      message: "Error fetching user's loans.",
      data: error
    }
  }
}

async function FetchExpiredLoans(token, currentUser, status) {
  const now = new Date();
  try {
    const loans = status
      ? loanData.filter((loan) => status === loan.status)
      : loanData;

    const filteredLoans = loans.filter(
      (loan) => new Date(loan.maturityDate) < now
    );

    const loansWithoutTotal = filteredLoans.map(
      ({ id, amount, maturityDate, status, applicant, createdAt }) => {
        const { totalLoan, ...restData } = applicant;
        return {
          id,
          amount,
          maturityDate,
          status,
          createdAt,
          applicant: restData,
        };
      }
    );

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to fetch expired loans data.",
      };
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtToken, (err, decoded) => {
        if (err) {
          resolve({
            success: false,
            message: "Unauthorized",
          });
        }

        if (
          decoded.id === currentUser.id &&
          decoded.email === currentUser.email
        ) {
          if (!filteredLoans) {
            resolve({
              success: false,
              message: "Error fetching expired loans.",
            });
          }

          if (filteredLoans.length === 0) {
            resolve({
              success: true,
              message: "There are no expired loans at the moment.",
              count: filteredLoans.length,
              data:
                decoded.role !== "admin" && decoded.role !== "superAdmin"
                  ? loansWithoutTotal
                  : filteredLoans,
            });
          }

          resolve({
            success: true,
            message: "Expired loans fetched successfully.",
            count: filteredLoans.length,
            data:
              decoded.role !== "admin" && decoded.role !== "superAdmin"
                ? loansWithoutTotal
                : filteredLoans,
          });
        } else {
          resolve({
            success: false,
            message: "Session token is invalid.",
          });
        }
      });
    });
  } catch (error) {
    return {
      success: false,
      message: "Error fetching expired loans.",
      data: error,
    };
  }
}

async function DeleteLoanById(token, currentUser, loanId) {
  try {
    const loanToDelete = loanData.find(
      (loan) => loanId === loan.id
    );

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to delete a loan.",
      };
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtToken, (err, decoded) => {
        if (err) {
          resolve({
            success: false,
            message: "Unauthorized",
          });
        }

        if (
          decoded.id === currentUser.id &&
          decoded.email === currentUser.email
        ) {
          if (decoded.role !== "superAdmin") {
            resolve({
              success: false,
              message: "You do not have permission to delete a loan."
            });
          }

          if (!loanToDelete) {
            resolve({
              success: false,
              message: "No loan with the given ID was found.",
            });
          }

          const loanToDeleteIndex = loanData.indexOf(loanToDelete);

          loanData.splice(loanToDeleteIndex, 1);

          resolve({
            success: true,
            message: `Loan with ID ${loanId} successfully deleted.`
          })
        } else {
          resolve({
            success: false,
            message: "Session token is invalid.",
          });
        }
      });
    });
  } catch (error) {
    return {
      success: false,
      message: "Error fetching user's loans.",
      data: error,
    };
  }
}

module.exports = {
  FetchAllLoans,
  FetchLoansByEmail,
  FetchExpiredLoans,
  DeleteLoanById
}