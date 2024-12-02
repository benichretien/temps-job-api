const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // res.status(400).json({ error: "Email and password are required" });
    throw new BadRequestError("Email and password are required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    // return res.status(401).json({ error: "Invalid Credentials" });
    throw new UnauthenticatedError("Invalid Credentials");
  }
  //compare password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    // return res.status(401).json({ error: "Invalid Password Credentials" });
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  // res.status(200).json({ user: { name: user.name }, token });
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
