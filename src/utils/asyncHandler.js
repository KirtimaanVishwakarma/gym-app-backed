const asyncHandler = (func) => async (req, res, next) => {
  try {
    return await func(req, res, next);
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export default asyncHandler;
// both are same depend on us to use
// ----------------------------------------------------------------
// const asyncHandler = (func) => {
//   (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch((error) => {
//       next(error);
//     });
//   };
// };

