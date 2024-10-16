import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import exceljs from 'exceljs';

@Injectable()
export class ExcelService {
  constructor(private prisma: PrismaService) {}

  async downloadFile() {
    const book = new exceljs.Workbook();

    book.creator = 'Server';
    book.created = new Date();

    const sheet = book.addWorksheet('users', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    sheet.columns = [
      { header: 'userId', key: 'id', width: 20 },
      { header: 'names', key: 'names', width: 20 },
      { header: 'lastNames', key: 'lastNames', width: 20 },
      { header: 'email', key: 'email', width: 40 },
      { header: 'role', key: 'role', width: 15 },
      { header: 'departments', key: 'departments', width: 30 },
      { header: 'directions', key: 'directions', width: 30 },
      { header: 'jobNumber', key: 'jobNumber', width: 20 },
      { header: 'contact', key: 'contact', width: 20 },
    ];

    // Styling first row:
    // ...

    // Getting all user data and saving it into the excel file:
    try {
      const userData = await this.prisma.user.findMany({
        select: {
          id: true,
          names: true,
          lastNames: true,
          email: true,
          role: true,
          departments: true,
          directions: true,
          jobNumber: true,
          contact: true,
        },
      });

      sheet.addRows(userData);

      const buffer = await book.xlsx.writeBuffer();

      return buffer;
    } catch (error) {
      console.log('something went wrong bro');
    }
  }
}
