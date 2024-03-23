const AuthServices = require('../services/AuthServices');

async function LogIn(req, res) {
  try {
    const { email, password } = req.body;

    const result = await AuthServices.LogIn(email, password);
    
    req.session.user = result.user;

    if (result.success) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send(result);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

async function LogOut(req, res) {
  try {
    const session = req.session;
    const result = await AuthServices.LogOut(session);

    if (result.success) {
      res.clearCookie("token");
      return res.status(200).send(result);
    } else {
      return res.status(500).send(result);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  LogIn,
  LogOut
};