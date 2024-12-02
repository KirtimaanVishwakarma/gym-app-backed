import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AdminUser } from '../models/admin-user.model.js';

const registerAdminUser = asyncHandler(async (req, res) => {
  // get user details form frontend
  const { name, email, mobile, address, gender, organizationName, password } =
    req.body;
  // validation
  if (
    [name, email, address, gender, organizationName, password].some(
      (field) => field?.trim() === ''
    ) ||
    !mobile
  ) {
    throw new ApiError(400, 'All fields are required!');
  }
  //Check user existed in db or not
  const existedUser = await AdminUser.findOne({ $or: [{ email }, { mobile }] });
  if (existedUser) {
    throw new ApiError(400, 'User already exists!');
  }

  //create user object - create entry in db
  // remove password and refresh token
  //check for user creation
  //return res
  // console.log(req.body);
  return res.status(200).json({ message: 'OK' });
});

export { registerAdminUser };
