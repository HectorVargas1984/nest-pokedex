import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    //importacion de con configmodule
    ConfigModule,

    // se importa los modulos de mongo con el esquema de mongo
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class PokemonModule {}
