import Joi from "joi";

export const categorytValidate = Joi.object({
    name: Joi.string().required(),
    image: Joi.string()
})

export const updateCategoryValidate = Joi.object({
    name: Joi.string().required(),
    image: Joi.string()
})


