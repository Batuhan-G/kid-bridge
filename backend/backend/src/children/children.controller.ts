import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  create(@Body() createChildDto: CreateChildDto, @Request() req) {
    return this.childrenService.create(createChildDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.childrenService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.childrenService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
    @Request() req,
  ) {
    return this.childrenService.update(id, updateChildDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.childrenService.remove(id, req.user.id);
  }

  @Post(':id/parents')
  addParent(
    @Param('id') childId: string,
    @Body('email') parentEmail: string,
    @Request() req,
  ) {
    return this.childrenService.addParent(childId, parentEmail, req.user.id);
  }
}
