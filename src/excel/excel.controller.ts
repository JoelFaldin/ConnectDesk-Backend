import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ExcelService } from './excel.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Get('download')
  async downloadFile() {
    return this.excelService.downloadFile();
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.uploadFile(file);
  }
}
