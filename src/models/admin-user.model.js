import mongoose, { Schema } from 'mongoose';
import { enums } from '../constants';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const adminUserSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true, index: true },
    mobile: { type: Number, require: true, unique: true, index: true },
    address: { type: String, require: true },
    gender: { type: String, require: true, enum: enums.gender },
    dob: { type: Date, require: true },
    role: { type: String, default: 'ADMIN', enum: enums.adminRoles },
    organizationName: { type: String, require: true },
    avatar: { type: Schema.Types.ObjectId, ref: 'File' },
    organizationLogo: { type: Schema.Types.ObjectId, ref: 'File' },
    status: { type: String, default: 'ACTIVE', enum: enums.activeStatus },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be atleast 6 characters'],
    },
    refreshToken: String,
  },
  { timestamps: true }
);

adminUserSchema.plugin(mongooseAggregatePaginate);

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// password encryption
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// check if password matches or not
adminUserSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generate access token method
adminUserSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role,
      organization: this.organizationName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  return token;
};

// generate refresh token method
adminUserSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return token;
};
