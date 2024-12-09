import { Schema } from 'mongoose';

const addressSchema = new Schema(
  {
    addressLine1: {
      type: String,
      required: [true,'AddressLine 1 is required'],
    },
    addressLine2: {
      type: String,
      required: [true,'AddressLine 2 is required'],
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
      required: [true,'City is required'],
    },
    state: {
      type: String,
      required: [true,'State is required'],
    },
  }
);
export default addressSchema;
