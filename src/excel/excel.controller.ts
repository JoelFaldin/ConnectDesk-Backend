import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Get('download')
  async downloadFile() {
    return this.excelService.downloadFile();
  }

  @Get('template')
  async downloadTemplate() {
    return this.excelService.downloadTemplate();
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.uploadFile(file);
  }
}
