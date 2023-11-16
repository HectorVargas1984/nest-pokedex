import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // con el metodo IsValidObjectId() puedo validar si es un id moongo
    if (!isValidObjectId(value))
      throw new BadRequestException(
        `el id: ${value}, no es un id valido de mongoDB`,
      );

    return value;
  }
}
