import { Controller, Get } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Get('download')
  async downloadFile() {
    return this.excelService.downloadFile();
  }
}
