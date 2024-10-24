import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Get('download')
  async downloadFile() {
    return this.excelService.downloadFile();
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    return this.excelService.downloadTemplate(res);
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.uploadFile(file);
  }
}
