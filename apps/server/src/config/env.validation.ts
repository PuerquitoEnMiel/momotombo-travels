import * as Joi from 'joi';

export interface EnvVars {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CLIENT_URL: string;
  CORS_ORIGINS: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CALLBACK_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  PINECONE_API_KEY?: string;
  GOOGLE_CLOUD_PROJECT?: string;
  GEMINI_API_KEY?: string;
  UPLOAD_DIR?: string;
  MAX_UPLOAD_SIZE_MB?: number;
  THROTTLE_TTL_MS?: number;
  THROTTLE_LIMIT?: number;
}

const schema = Joi.object<EnvVars>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'JWT_SECRET must be at least 32 characters long',
    'any.required': 'JWT_SECRET is required (use a long random string)',
  }),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  CLIENT_URL: Joi.string().uri().default('http://localhost:3000'),
  CORS_ORIGINS: Joi.string()
    .default('http://localhost:3000,http://127.0.0.1:3000')
    .description('Comma-separated list of allowed CORS origins'),
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().optional(),
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
  PINECONE_API_KEY: Joi.string().optional(),
  GOOGLE_CLOUD_PROJECT: Joi.string().optional(),
  GEMINI_API_KEY: Joi.string().optional(),
  UPLOAD_DIR: Joi.string().default('./uploads'),
  MAX_UPLOAD_SIZE_MB: Joi.number().default(5),
  THROTTLE_TTL_MS: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(20),
}).unknown(true);

export function validateEnv(raw: NodeJS.ProcessEnv = process.env): EnvVars {
  const validation = schema.validate(raw, {
    abortEarly: false,
    stripUnknown: false,
    convert: true,
  });

  if (validation.error) {
    const details = validation.error.details
      .map((d) => `  • ${d.message}`)
      .join('\n');
    throw new Error(
      `\n❌ Invalid environment configuration:\n${details}\n\nPlease check your .env file.\n`,
    );
  }

  const value: EnvVars = validation.value;

  // Production-only safety nets
  if (value.NODE_ENV === 'production') {
    const prodRequired: Array<[string, string | undefined]> = [
      ['STRIPE_SECRET_KEY', value.STRIPE_SECRET_KEY],
      ['STRIPE_WEBHOOK_SECRET', value.STRIPE_WEBHOOK_SECRET],
      ['GOOGLE_CLIENT_ID', value.GOOGLE_CLIENT_ID],
      ['GOOGLE_CLIENT_SECRET', value.GOOGLE_CLIENT_SECRET],
    ];
    const missing = prodRequired
      .filter(
        ([, v]) => !v || v.startsWith('sk_test_dev-') || v.startsWith('dev-'),
      )
      .map(([k]) => k);
    if (missing.length) {
      // We only warn in production builds so deploys don't fail without these in dev.

      console.warn(
        `⚠️  Production is missing real credentials for: ${missing.join(', ')}. ` +
          `Some integrations will be disabled.`,
      );
    }
  }

  return value;
}
