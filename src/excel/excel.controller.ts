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
  async downloadFile(@Res() res: Response) {
    return this.excelService.downloadFile(res);
  }

  @Get('download/logs')
  async downloadlogsExcelFile(@Res() res: Response) {
    return this.excelService.downloadLogsFile(res);
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    return this.excelService.downloadTemplate(res);
  }

  @Get('summary')
  getSummary() {
    return this.excelService.getSummary();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('excelFile'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.uploadFile(file);
  }
}
