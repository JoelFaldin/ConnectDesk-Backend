import { Controller, Get, Param, Query } from '@nestjs/common';

import { LogsService } from './logs.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query() queryValues: PaginationDto) {
    return this.logsService.findAll(queryValues);
  }

  @Get('summary')
  getSummary() {
    return this.logsService.getSummary();
  }

  @Get('all')
  getAllLogs() {
    return this.logsService.getAll();
  }

  @Get(':code')
  findByCode(@Param('code') code: string, @Query() queryValues: PaginationDto) {
    if (Number(code) === 1) {
      return this.logsService.findAll(queryValues);
    }

    return this.logsService.findByCode(+code, queryValues);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }
}
