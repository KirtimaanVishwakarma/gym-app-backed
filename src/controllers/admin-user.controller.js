import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AdminUser } from '../models/admin-user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import emailHandler from '../utils/emailHandler.js';
import getResetToken from '../utils/getResetToken.js';

const registerAdminUser = asyncHandler(async (req, res) => {
  // get user details form frontend
  const { name, email, mobile, address, gender, organizationName, password } =
    req.body;
  // validation
  if (
    [name, email, gender, organizationName, password].some((field) => !field) ||
    !mobile
  ) {
    throw new ApiError(400, 'All fields are required!');
  }
  //Check user existed in db or not
  const existedUser = await AdminUser.findOne({ $or: [{ email }, { mobile }] });
  if (existedUser) {
    throw new ApiError(409, 'User already exists!');
  }

  //create user object - create entry in db
  const adminUser = await AdminUser.create({
    name,
    email,
    mobile,
    address,
    gender,
    organizationName,
    password,
  });

  if (!adminUser) {
    throw new ApiError(500, 'Failed to create user!');
  }
  const resetPasswordToken = await adminUser.getResetPasswordToken();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetPasswordToken}`;
  const message = `Congratulations ${name}, you have been onboard successfully. Click the link below to to update your password\n ${url}`;

  await emailHandler(email, 'Onboarding', message);
  await adminUser.save();
  return res
    .status(201)
    .json(new ApiResponse(201, 'User created successfully!', adminUser));
});

//reset password
const resetAdminPassword = asyncHandler(async (req, res) => {
  const { token } = req.query; //token comes from mail sent to mail id
  const resetPasswordToken = getResetToken(token);
  const user = await AdminUser.findOne({
    resetPasswordToken: resetPasswordToken,
    
  });
  
  if (!user) {
    throw new ApiError(404, 'Invalid or expired token!');
  }

  user.password = req.body.password;
  user.resetPasswordExpiry = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  res
    .status(200)
    .json(new ApiResponse(200, 'Password updated successfully!', user));
});

export { registerAdminUser, resetAdminPassword };
