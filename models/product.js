import mongoose, { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String },
    price: { type: String },
    user: { type: Types.ObjectId, required: true, ref: 'user' }
}, {
    timestamps: true
}
);

// productSchema.index({ name: 'text', title: 'text' })

productSchema.plugin(toJSON)

export const ProductModel = model('product', productSchema)