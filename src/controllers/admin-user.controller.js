import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AdminUser } from '../models/admin-user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import emailHandler from '../utils/emailHandler.js';
import getResetToken from '../utils/getResetToken.js';
import { clearToken, sendToken } from '../utils/cookieHandler.js';
import generateAccessAndRefreshToken from '../utils/generateAccessAndRefreshToken.js';

//==================== Admin-registration =================
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

  await emailHandler(email, 'Onboarding Successful', message);
  await adminUser.save();
  return res
    .status(201)
    .json(new ApiResponse(201, 'User created successfully!', adminUser));
});
//==================== Admin-registration =================

//==================== Reset password  =================
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
//==================== Reset password  =================

//==================== Update Profile  =================
const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updates = req.body;
  const allowedUpdates = [
    'name',
    'address',
    'gender',
    'dob',
    'organizationName',
    'avatar',
    'organizationLogo',
  ];
  const updateKeys = Object.keys(updates);

  const isValidOperation = updateKeys.every((key) =>
    allowedUpdates.includes(key)
  );

  if (!isValidOperation) {
    throw new ApiError(400, 'Invalid update request');
  }
  const updatedUser = await AdminUser.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new ApiError(404, 'Invalid requested user!');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Profile updated successfully!', updatedUser));
});
//==================== Update Profile  =================

//==================== Admin Login  =================
const adminLogin = asyncHandler(async (req, res) => {
  const { email, mobile, password } = req.body;

  if (!(email || mobile) || !password) {
    throw new ApiError(400, 'Email or mobile and password are required!');
  }

  const user = await AdminUser.findOne({
    $or: [{ email }, { mobile }],
  }).select('+password');

  if (!user || !(await user.isPasswordMatched(password))) {
    throw new ApiError(401, 'Invalid email or password!');
  }
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  sendToken(res, 200, accessToken, refreshToken, 'Logged in successfully!', {
    user,
    accessToken,
    refreshToken,
  });
});
//==================== Admin Login  =================

//==================== new access and refresh token  =================
const refreshToken = asyncHandler(async (req, res) => {
  const requestedRefreshToken = req.body?.refreshToken;

  if (!requestedRefreshToken) {
    throw new ApiError(401, 'No refresh token provided!');
  }
  const user = await AdminUser.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: false,
    }
  );

  if (!user) {
    throw new ApiError(403, 'Invalid user found!');
  }
  if (user.refreshToken !== requestedRefreshToken) {
    clearToken(res, 403, 'Refresh token is expired or used!', null);
    return;
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  sendToken(
    res,
    200,
    accessToken,
    refreshToken,
    'Token refreshed successfully!',
    {
      accessToken,
      refreshToken,
    }
  );
});
//==================== new access and refresh token  =================

//==================== Admin logout  =================
const adminLogout = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw new ApiError(401, 'User not logged in!');
  }

  const user = await AdminUser.findByIdAndUpdate(
    _id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  clearToken(res, 200, 'Logged out successfully!', {});
});
//==================== Admin logout  =================

export {
  registerAdminUser,
  resetAdminPassword,
  adminLogin,
  updateProfile,
  adminLogout,
  refreshToken,
};
