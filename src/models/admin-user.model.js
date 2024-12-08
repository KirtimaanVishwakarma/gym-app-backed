import mongoose, { Schema } from 'mongoose';
import { enums, regex } from '../constants.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import addressSchema from './address.model.js';
import crypto from 'crypto';

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return regex.email.test(v);
        },
        message: (props) => `${props.value} Please enter valid email address!`,
      },
      index: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return regex.mobile.test(v); // Regex for Indian mobile numbers
        },
        message: (props) => `${props.value} Please enter valid mobile number!`,
      },
      index: true,
    },
    address: addressSchema,
    gender: { type: String, required: true, enum: enums.gender },
    dob: Number,
    role: { type: String, default: 'ADMIN', enum: enums.adminRoles },
    organizationName: { type: String, required: true },
    avatar: { type: Schema.Types.ObjectId, ref: 'File' },
    parentAdmin: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    organizationLogo: { type: Schema.Types.ObjectId, ref: 'File' },
    status: { type: String, default: 'PENDING', enum: enums.activeStatus },
    isNewUser: { type: Boolean, default: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be atleast 6 characters'],
      select: false,
    },
    refreshToken: { type: String },
    resetPasswordToken: String,
    resetPasswordExpiry: String,
  },
  { timestamps: true }
);

adminUserSchema.plugin(mongooseAggregatePaginate);

// password encryption
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
  next();
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
      isNewUser: this.isNewUser,
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

adminUserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  // hashing token using "sha256" algorithem
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
