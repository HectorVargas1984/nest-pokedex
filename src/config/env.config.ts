export const EnvConfiguration = () => ({
  //es la configuracion de la variables de entorno para utilizarlas dentro de la aplicacion

  enviromment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
  default_limit: +process.env.DEFAULT_LIMIT || 7,
});
