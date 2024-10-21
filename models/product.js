import mongoose, { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image:{type:String},
    category:{type:String},
    price:{type:String}
},{
    timestamps: true
}
);

productSchema.index({title:'text', description:'text'})

productSchema.plugin(toJSON)

export const ProductModel = model('product', productSchema)