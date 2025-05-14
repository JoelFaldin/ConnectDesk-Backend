import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import exceljs from 'exceljs';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExcelService {
  constructor(private prisma: PrismaService) {}

  async downloadFile(res: Response) {
    const book = new exceljs.Workbook();

    book.creator = 'Server';
    book.created = new Date();

    const sheet = book.addWorksheet('users', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    sheet.columns = [
      { header: 'rut', key: 'rut', width: 20 },
      { header: 'names', key: 'names', width: 20 },
      { header: 'lastNames', key: 'lastNames', width: 20 },
      { header: 'email', key: 'email', width: 40 },
      { header: 'role', key: 'role', width: 15 },
      { header: 'departments', key: 'departments', width: 30 },
      { header: 'directions', key: 'directions', width: 30 },
      { header: 'jobNumber', key: 'jobNumber', width: 20 },
      { header: 'contact', key: 'contact', width: 20 },
    ];

    const headers = sheet.getRow(1);
    headers.eachCell((cell) => {
      cell.style.font = {
        bold: true,
      };
      cell.style.border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      cell.style.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'e0e0e0',
        },
      };
    });

    // Getting all user data and saving it into the excel file:
    try {
      const userData = await this.prisma.user.findMany({
        select: {
          rut: true,
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
    } catch (error) {
      throw new HttpException(
        'There was a problem in the server trying to generate the file, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const buffer = await book.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=userdata.xlsx');

    return res.end(buffer, 'binary');
  }

  async downloadLogsFile(res: Response) {
    const book = new exceljs.Workbook();

    book.creator = 'Server';
    book.created = new Date();

    const sheet = book.addWorksheet('logs', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    sheet.columns = [
      { header: 'LogId', key: 'logId', width: 40 },
      { header: 'Endpoint', key: 'endpoint', width: 20 },
      { header: 'Method', key: 'method', width: 10 },
      { header: 'Status code', key: 'statusCode', width: 5 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Date', key: 'date', width: 10 },
    ];

    const headers = sheet.getRow(1);
    headers.eachCell((cell) => {
      cell.style.font = {
        bold: true,
      };
      cell.style.border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      cell.style.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'e0e0e0',
        },
      };
    });

    // Getting all user data and saving it into the excel file:
    try {
      const userData = await this.prisma.logs.findMany({
        select: {
          logId: true,
          userId: false,
          endpoint: true,
          method: true,
          statusCode: true,
          description: true,
          date: true,
        },
      });

      sheet.addRows(userData);
    } catch (error) {
      throw new HttpException(
        'There was a problem in the server trying to generate the file, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const buffer = await book.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=logsdata.xlsx');

    return res.end(buffer, 'binary');
  }

  async downloadTemplate(res: Response) {
    const book = new exceljs.Workbook();

    book.creator = 'Server';
    book.created = new Date();

    const sheet = book.addWorksheet('template');

    sheet.columns = [
      { header: 'rut', key: 'id', width: 20 },
      { header: 'names', key: 'names', width: 20 },
      { header: 'lastNames', key: 'lastNames', width: 20 },
      { header: 'email', key: 'email', width: 30 },
      { header: 'role', key: 'role', width: 15 },
      { header: 'departments', key: 'departments', width: 30 },
      { header: 'directions', key: 'directions', width: 30 },
      { header: 'jobNumber', key: 'jobNumber', width: 20 },
      { header: 'contact', key: 'contact', width: 20 },
    ];

    const headers = sheet.getRow(1);
    headers.eachCell((cell) => {
      (cell.style.font = { bold: true }),
        (cell.style.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
          left: { style: 'thin' },
        });
      cell.style.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'e0e0e0',
        },
      };
    });

    const buffer = await book.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');

    return res.end(buffer, 'binary');
  }

  async getSummary() {
    try {
      const successCount = await this.prisma.logs.count({
        where: {
          endpoint: {
            contains: 'excel',
          },
          statusCode: { in: [200, 201] },
        },
      });

      const errorCount = await this.prisma.logs.count({
        where: {
          endpoint: {
            contains: 'excel',
          },
          statusCode: { in: [400, 500] },
        },
      });

      return {
        successCount,
        errorCount,
      };
    } catch (error) {
      throw new HttpException(
        'Server couldnt read the file corectly.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const book = new exceljs.Workbook();
      await book.xlsx.load(file.buffer);

      const worksheet = book.getWorksheet(1);
      const excelData = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber != 1 && Array.isArray(row.values)) {
          const [
            _val,
            rut,
            names,
            lastNames,
            emailObj,
            role,
            departments,
            directions,
            jobNumber,
            contact,
          ] = row.values as [
            string,
            string,
            string,
            string,
            { text: string },
            string,
            string,
            string,
            string,
            string,
          ];

          excelData.push({
            rut,
            names,
            lastNames,
            email: emailObj.text,
            role,
            departments,
            directions,
            jobNumber: jobNumber.toString(),
            contact: contact.toString(),
          });
        }
      });

      await this.prisma.user.createMany({
        data: excelData,
      });

      return {
        message: 'Data successfully saved in the database!',
      };
    } catch (error) {
      throw new HttpException(
        'Server couldnt read the file corectly.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
