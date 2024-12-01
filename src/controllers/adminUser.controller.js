import asyncHandler from '../utils/asyncHandler.js';

const registerAdminUser = asyncHandler(async (req, res) => {
 return res.status(200).json({ message: 'OK' });
});

export { registerAdminUser };
