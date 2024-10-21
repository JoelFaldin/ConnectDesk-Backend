import 'dotenv/config';
import joi from 'joi';

interface EnvVals {
  PORT: number;
  SECRET: string;
  EMAIL_ADDRESS: string;
  EMAIL_PASS: string;
}

const envsScheme = joi
  .object({
    PORT: joi.number().required(),
    SECRET: joi.string().required(),
    EMAIL_ADDRESS: joi.string().required(),
    EMAIL_PASS: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsScheme.validate(process.env);

if (error) {
  throw new Error(`Env config validation error: ${error.message}`);
}

const envVals: EnvVals = value;

export const envs = {
  port: envVals.PORT,
  secret: envVals.SECRET,
  EMAIL_ADDRESS: envVals.EMAIL_ADDRESS,
  EMAIL_PASS: envVals.EMAIL_PASS,
};
