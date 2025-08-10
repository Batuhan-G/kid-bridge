import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  async create(createChildDto: CreateChildDto, parentId: string) {
    const child = await this.prisma.child.create({
      data: {
        ...createChildDto,
        dateOfBirth: new Date(createChildDto.dateOfBirth),
        parents: {
          connect: { id: parentId },
        },
      },
      include: {
        parents: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return child;
  }

  async findAll(parentId: string) {
    return this.prisma.child.findMany({
      where: {
        parents: {
          some: {
            id: parentId,
          },
        },
        isActive: true,
      },
      include: {
        parents: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            messages: true,
            expenses: true,
            activities: true,
            documents: true,
            milestones: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, parentId: string) {
    const child = await this.prisma.child.findFirst({
      where: {
        id,
        parents: {
          some: {
            id: parentId,
          },
        },
        isActive: true,
      },
      include: {
        parents: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        documents: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        milestones: {
          orderBy: {
            achievedAt: 'desc',
          },
        },
        _count: {
          select: {
            messages: true,
            expenses: true,
            activities: true,
          },
        },
      },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return child;
  }

  async update(id: string, updateChildDto: UpdateChildDto, parentId: string) {
    // Verify parent has access to this child
    const existingChild = await this.findOne(id, parentId);

    const updatedChild = await this.prisma.child.update({
      where: { id },
      data: {
        ...updateChildDto,
        dateOfBirth: updateChildDto.dateOfBirth
          ? new Date(updateChildDto.dateOfBirth)
          : undefined,
      },
      include: {
        parents: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedChild;
  }

  async remove(id: string, parentId: string) {
    // Verify parent has access to this child
    await this.findOne(id, parentId);

    // Soft delete
    return this.prisma.child.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addParent(
    childId: string,
    parentEmail: string,
    requestingParentId: string,
  ) {
    // Verify requesting parent has access to this child
    await this.findOne(childId, requestingParentId);

    // Find the parent to add
    const parentToAdd = await this.prisma.user.findUnique({
      where: { email: parentEmail },
    });

    if (!parentToAdd) {
      throw new NotFoundException('Parent not found');
    }

    // Connect the parent to the child
    return this.prisma.child.update({
      where: { id: childId },
      data: {
        parents: {
          connect: { id: parentToAdd.id },
        },
      },
      include: {
        parents: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}
