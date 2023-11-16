import * as Join from 'joi';

export const JoiValidationSchema = Join.object({
  // herramienta para validar variables de entorno}

  MONGODB: Join.required(),
  PORT: Join.number().default(3005),
  DEFAULT_LIMIT: Join.number().default(8),
});
