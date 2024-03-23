const jwt = require("jsonwebtoken");

const staffData = require("../data/staffs.json");

async function LogIn(email, password) {
  try {
    const staff = staffData.find((data) => data.email === email);

    if (!staff) {
      return {
        success: false,
        message: "An account with this email does not exist.",
      };
    }

    if (password !== staff.password) {
      return {
        success: false,
        message: "The password is invalid.",
      };
    }

    const user = { id: staff.id, email: staff.email, role: staff.role };

    const token = jwt.sign(
      user,
      process.env.JWT_SECRET_KEY
    );

    return {
      success: true,
      message: "You have successfully logged in.",
      token,
      user
    };
  } catch (error) {
    return {
      success: false,
      message: "Error logging in.",
      data: error,
    };
  }
}

async function LogOut(session) {
  try {
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          reject({
            success: false,
            message: "Unable to log out.",
            data: err,
          });
        } else {
          resolve({
            success: true,
            message: "You have logged out successfully.",
            data: {},
          });
        }
      });
    });
  } catch (error) {
    return {
      success: false,
      message: "Error logging out.",
      data: error,
    };
  }
}

module.exports = {
  LogIn,
  LogOut
}