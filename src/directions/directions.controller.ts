import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateDirectionDTO, UpdateDirectionDTO } from './dto/direction.dto';
import { DirectionsService } from './directions.service';

@Controller('directions')
export class DirectionsController {
  constructor(private directionService: DirectionsService) {}

  @Get()
  getDirections() {
    return this.directionService.getDirections();
  }

  @Post()
  createDirection(@Body() directionData: CreateDirectionDTO) {
    return this.directionService.createDirection(directionData);
  }

  @Patch(':id')
  updateDirection(
    @Body() updatedDirection: UpdateDirectionDTO,
    @Param('id') id: string,
  ) {
    return this.directionService.updateDirection(id, updatedDirection);
  }

  @Delete(':id')
  deleteDirection(@Param('id') id: string) {
    return this.directionService.deleteDirection(id);
  }
}
