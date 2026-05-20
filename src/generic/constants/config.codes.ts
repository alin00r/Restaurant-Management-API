import * as Joi from 'joi';

export const CONFIG_VARIABLE_CODES = {
  MODE: 'MODE',
  PORT: 'PORT',
  MONGODB_URI: 'MONGODB_URI',
};

export const CONFIG_VALIDATION_JOI = Joi.object({
  MODE: Joi.string().valid('DEV', 'TEST', 'PROD').default('DEV'),
  PORT: Joi.number().required().min(0),
  MONGODB_URI: Joi.string().required().uri(),
});
