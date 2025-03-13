const Joi = require('joi');

const listingSchema = Joi.object({
    title : Joi.string().required(),
    description : Joi.string().required(),
    image : Joi.string().allow("",null),
    price: Joi.number().integer().min(0).required(),
    location : Joi.string().required(),
    country : Joi.string().required()
})

const reviewSchema = Joi.object({
    rating : Joi.number().required(),
    comment : Joi.string().required(),
});

module.exports = {listingSchema,reviewSchema};