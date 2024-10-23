import mongoose, { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


export const categorySchema = new Schema({
    name: {type: String, required: true},
    image: { type: String }
},{
    timestamps: true
})

categorySchema.plugin(toJSON)

export const CategoryModel = model('category', categorySchema)