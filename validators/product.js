import Joi from "joi";

export const productValidate = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string(),
    category: Joi.string(),
    price: Joi.string()
})


