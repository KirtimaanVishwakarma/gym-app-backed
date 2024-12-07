import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/admin-user.model.js';

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await AdminUser.findById(decodedToken.id).select(
      '-password -refreshToken'
    );
    if (!user) {
      throw new ApiError(403, 'Unauthorized access');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

export default verifyJWT;
