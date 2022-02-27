const Joi = require('joi')

export const projectSchema = {
    name: Joi.string().required(),
    status: Joi.string().default('pending'),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
}