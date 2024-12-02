import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localFilePath);
    // console.log('Uploaded FIle :' + response);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved file
    // console.log('Upload Failed :' + error);
    return null;
  }
};

const deleteFileOnCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;
    const fileDeleted = await cloudinary.uploader.destroy(public_id);
    console.log('fileDeleted', fileDeleted);
    return fileDeleted;
  } catch (error) {
    return null;
  }
};
export { deleteFileOnCloudinary };
export default uploadOnCloudinary;
