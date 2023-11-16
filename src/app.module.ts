import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    // es para configurar las variables de entorno, donde se llama una
    // una funcion que esta en la carperta config/env.config.ts
    ConfigModule.forRoot({
      // es para hacer configuraciones
      load: [EnvConfiguration],
      // es para hacer validaciones
      validationSchema: JoiValidationSchema,
    }),

    /**
     * nos sirve para cargar el contenido estatico de nuestar aplicacion
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    //se carga el modulo de mongo, con la conexion y el nombre de la db
    MongooseModule.forRoot(process.env.MONGODB, { dbName: 'pokemondb' }),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
