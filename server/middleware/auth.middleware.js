import jwt from "jsonwebtoken";
import { environment } from "../config/environment.js";
import { User } from "../models/user.model.js";

export async function requireAuthentication(request, response, next) {
  const authorizationHeader = request.get("authorization");
  const bearerToken = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : undefined;
  const token = bearerToken ?? request.cookies.portfolio_token;

  if (!token) return response.status(401).json({ error: "Authentication is required." });

  try {
    const payload = jwt.verify(token, environment.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return response.status(401).json({ error: "The authenticated user no longer exists." });
    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ error: "The authentication token is invalid or expired." });
  }
}
