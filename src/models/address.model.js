import { Schema } from 'mongoose';

const addressSchema = new Schema(
  {
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: true,
    },
    addressLine3: {
      type: String,
    },
    pincode: {
      type: Number,
      required: true,
      minLength: [6, 'Pincode length must be 6 digits'],
      maxLength: [6, 'Pincode length must be 6 digits'],
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  }
);
export default addressSchema;
