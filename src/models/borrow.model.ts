import mongoose, { Document, Schema } from "mongoose";

export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowSchema = new Schema<IBorrow>({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: [true, "Book is required"] },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer"
    }
  },
  dueDate: { type: Date, required: [true, "dueDate is required"] }
}, { timestamps: true });

export const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);
