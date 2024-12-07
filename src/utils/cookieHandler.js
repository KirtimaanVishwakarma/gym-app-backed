import { cookiesOption } from '../constants.js';
import ApiResponse from './ApiResponse.js';

const sendToken = (
  res,
  statusCode = 200,
  accessToken,
  refreshToken,
  message,
  data
) => {
  res
    .status(statusCode)
    .cookie('accessToken', accessToken, cookiesOption)
    .cookie('refreshToken', refreshToken, cookiesOption)
    .json(new ApiResponse(statusCode, message, data));
};

const clearToken = (
  res,
  statusCode = 200,
  message,
  data
) => {
  res
    .status(statusCode)
    .clearCookie('accessToken', cookiesOption)
    .clearCookie('refreshToken', cookiesOption)
    .json(new ApiResponse(statusCode, message, data));
};
export { sendToken, clearToken };
