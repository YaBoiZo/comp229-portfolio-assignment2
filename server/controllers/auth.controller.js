import jwt from "jsonwebtoken";
import { environment } from "../config/environment.js";
import { User } from "../models/user.model.js";

function createToken(userId) {
  return jwt.sign({ sub: userId }, environment.jwtSecret, { expiresIn: environment.jwtExpiresIn });
}

export const authController = {
  async signIn(request, response) {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchesPassword(password))) {
      return response.status(401).json({ error: "Invalid email or password." });
    }

    const token = createToken(user.id);
    response.cookie("portfolio_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: environment.nodeEnv === "production",
      maxAge: 2 * 60 * 60 * 1000,
    });
    return response.json({ token, user: user.toJSON() });
  },

  signOut(_request, response) {
    response.clearCookie("portfolio_token");
    response.json({ message: "Signed out successfully." });
  },

  profile(request, response) {
    response.json(request.user);
  },
};
