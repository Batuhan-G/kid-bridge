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
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesQueryDto } from './dto/get-expenses-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query() query: GetExpensesQueryDto) {
    return this.expensesService.findAll(req.user.id, query);
  }

  @Get('stats')
  getStats(@Request() req, @Query('childId') childId?: string) {
    return this.expensesService.getStats(req.user.id, childId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.update(id, updateExpenseDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.expensesService.remove(id, req.user.id);
  }
}