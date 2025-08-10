import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesQueryDto } from './dto/get-expenses-query.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    // Input validation
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('Invalid user ID');
    }

    if (
      !createExpenseDto.childId ||
      typeof createExpenseDto.childId !== 'string'
    ) {
      throw new BadRequestException('Invalid child ID');
    }

    if (createExpenseDto.amount <= 0 || createExpenseDto.amount > 1000000) {
      throw new BadRequestException('Amount must be between 0 and 1,000,000');
    }

    // Validate expense date is not in the future
    const expenseDate = new Date(createExpenseDto.expenseDate);
    const today = new Date();
    if (expenseDate > today) {
      throw new BadRequestException('Expense date cannot be in the future');
    }

    // Verify user has access to the child
    const child = await this.prisma.child.findFirst({
      where: {
        id: createExpenseDto.childId,
        parents: {
          some: {
            id: userId,
          },
        },
        isActive: true,
      },
    });

    if (!child) {
      throw new NotFoundException('Child not found or access denied');
    }

    const expense = await this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        expenseDate: new Date(createExpenseDto.expenseDate),
        createdById: userId,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return expense;
  }

  async findAll(userId: string, query: GetExpensesQueryDto) {
    const whereClause: any = {
      child: {
        parents: {
          some: {
            id: userId,
          },
        },
        isActive: true,
      },
    };

    // Apply filters
    if (query.childId) {
      whereClause.childId = query.childId;
    }

    if (query.category) {
      whereClause.category = query.category;
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.startDate || query.endDate) {
      whereClause.expenseDate = {};
      if (query.startDate) {
        whereClause.expenseDate.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.expenseDate.lte = new Date(query.endDate);
      }
    }

    return this.prisma.expense.findMany({
      where: whereClause,
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        expenseDate: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        child: {
          parents: {
            some: {
              id: userId,
            },
          },
          isActive: true,
        },
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
    // Find the expense and verify user has access
    const existingExpense = await this.findOne(id, userId);

    // Only allow the creator to update the expense
    if (existingExpense.createdById !== userId) {
      throw new ForbiddenException('You can only update expenses you created');
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data: {
        ...updateExpenseDto,
        expenseDate: updateExpenseDto.expenseDate
          ? new Date(updateExpenseDto.expenseDate)
          : undefined,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedExpense;
  }

  async remove(id: string, userId: string) {
    // Find the expense and verify user has access
    const existingExpense = await this.findOne(id, userId);

    // Only allow the creator to delete the expense
    if (existingExpense.createdById !== userId) {
      throw new ForbiddenException('You can only delete expenses you created');
    }

    return this.prisma.expense.delete({
      where: { id },
    });
  }

  async getStats(userId: string, childId?: string) {
    const whereClause: any = {
      child: {
        parents: {
          some: {
            id: userId,
          },
        },
        isActive: true,
      },
    };

    if (childId) {
      whereClause.childId = childId;
    }

    const expenses = await this.prisma.expense.findMany({
      where: whereClause,
      select: {
        amount: true,
        expenseDate: true,
        category: true,
      },
    });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonth = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.expenseDate);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const lastMonth = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.expenseDate);
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        return (
          expenseDate.getMonth() === lastMonthDate.getMonth() &&
          expenseDate.getFullYear() === lastMonthDate.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const change =
      lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    const categoryStats = expenses.reduce(
      (acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += expense.amount;
        acc[category].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    return {
      total,
      thisMonth,
      lastMonth,
      change,
      categoryStats,
      totalExpenses: expenses.length,
      averageExpense: expenses.length > 0 ? total / expenses.length : 0,
    };
  }
}
