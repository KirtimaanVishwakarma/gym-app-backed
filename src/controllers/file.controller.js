import { Files } from '../models/file.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import uploadOnCloudinary, {
  deleteFileOnCloudinary,
} from '../utils/cloudinary.js';

const getAllFiles = asyncHandler(async (req, res) => {
  const files = await Files.find();
  return res.json(new ApiResponse(200, 'Files retrieved successfully', files));
});

const uploadFile = asyncHandler(async (req, res) => {
  // req.files comes using multer to handle files
  const localPath = req.files?.File[0]?.path;

  if (!localPath) {
    throw new ApiError(404, 'File is required!');
  }
  const uploadedResponse = await uploadOnCloudinary(localPath);

  const { public_id, url, format, bytes, duration, original_filename } =
    uploadedResponse;

  const filename = original_filename
    .split('-')
    ?.filter((_, ind) => ind !== 0)
    .join();

  const file = await Files.create({
    public_id,
    url,
    format,
    bytes,
    duration: duration || 0,
    filename,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, 'File successfully uploaded', file));
});

const deleteFile = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw new ApiError(400, 'Id is required!');
  }

  const file = await Files.findByIdAndDelete(id);
  if (!file) {
    throw new ApiError(404, 'Invalid id provided!');
  }

  await deleteFileOnCloudinary(file?.public_id);

  return res
    .status(200)
    .json(new ApiResponse(200, 'File deleted successfully'));
});

export { getAllFiles, uploadFile, deleteFile };
