import asyncHandler from '../utils/asyncHandler.js';

const registerAdminUser = asyncHandler(async (req, res) => {
  // get user details form frontend
  // validation
  //create user object - create entry in db
  // remove password and refresh token
  //check for user creation
  //return res
  console.log(req.body);
  return res.status(200).json({ message: 'OK' });
});

export { registerAdminUser };
