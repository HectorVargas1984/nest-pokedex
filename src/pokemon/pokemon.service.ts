import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  //

  private defaulLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private configService: ConfigService,
  ) {
    this.defaulLimit = this.configService.get<number>('default_limit');

    console.log(this.defaulLimit);
  }

  async create(createPokemonDto: CreatePokemonDto) {
    //

    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();

      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return {
        status: 'ok',
        createPokemonDto: pokemon,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaulLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find().limit(limit).skip(offset);
  }

  async findOne(term: string) {
    //

    let pokemon: Pokemon;

    pokemon = await this.buscarPokemon(term);

    return {
      status: 'ok',
      resp: pokemon,
    };
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.buscarPokemon(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });

      return {
        status: 'ok',
        resp: { ...pokemon.toJSON(), ...updatePokemonDto },
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  async remove(id: string) {
    const respuesta = await this.pokemonModel.deleteOne({ _id: id });

    if (respuesta.deletedCount === 0)
      throw new BadRequestException(
        `El id: ${id} Pokemon no se encontro en la base de datos`,
      );

    return {
      status: 'ok',
      resp: respuesta,
    };
  }

  async buscarPokemon(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon con id, name, o no "${term}" no fue encontrado en la base de datos`,
      );

    return pokemon;
  }

  private catchError(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon duplicado en la base de datos ${JSON.stringify(
          error.keyValue,
        )}`,
      );

    throw new InternalServerErrorException(
      `Error en la base de datos - revisar logs`,
    );
  }
}
