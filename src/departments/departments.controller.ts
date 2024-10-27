import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { NewDepartmentDTO } from './dto/departments.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get()
  getDepartments() {
    return this.departmentsService.getDepartments();
  }

  @Post()
  createDepartment(@Body() departmentData: NewDepartmentDTO) {
    return this.departmentsService.createDepartment(departmentData);
  }

  @Patch(':id')
  updateDepartment(
    @Param('id') id: string,
    @Body() departmentData: NewDepartmentDTO,
  ) {
    return this.departmentsService.updateDepartment(id, departmentData);
  }

  @Delete(':id')
  deleteDepartment(@Param('id') id: string) {
    return this.departmentsService.deleteDepartment(id);
  }
}
