import 'dotenv/config';
import joi from 'joi';

interface EnvVals {
  PORT: number;
  SECRET: string;
}

const envsScheme = joi
  .object({
    PORT: joi.number().required(),
    SECRET: joi.string().required(),
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
};
