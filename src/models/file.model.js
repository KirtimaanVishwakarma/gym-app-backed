import mongoose, { Schema } from 'mongoose';

const fileSchema = new Schema(
  {
    public_id: String,
    url: String,
    format: String,
    bytes: Number,
    duration: { type: Number, default: 0 },
    filename: String,
  },
  { timestamps: true }
);

export const Files = mongoose.model('File', fileSchema);
