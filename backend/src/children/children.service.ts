import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { CreateDocumentDto } from './dto/create-document.dto';

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

  // Milestone management
  async createMilestone(childId: string, createMilestoneDto: CreateMilestoneDto, parentId: string) {
    // Verify parent has access to this child
    await this.findOne(childId, parentId);

    return this.prisma.milestone.create({
      data: {
        title: createMilestoneDto.title,
        description: createMilestoneDto.description,
        achievedAt: new Date(createMilestoneDto.achievedAt),
        category: createMilestoneDto.category,
        notes: createMilestoneDto.notes,
        childId,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getMilestones(childId: string, parentId: string) {
    // Verify parent has access to this child
    await this.findOne(childId, parentId);

    return this.prisma.milestone.findMany({
      where: { childId },
      orderBy: { achievedAt: 'desc' },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateMilestone(milestoneId: string, updateData: Partial<CreateMilestoneDto>, parentId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { child: true },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    // Verify parent has access to this child
    await this.findOne(milestone.childId, parentId);

    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        ...updateData,
        achievedAt: updateData.achievedAt ? new Date(updateData.achievedAt) : undefined,
      },
    });
  }

  async deleteMilestone(milestoneId: string, parentId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { child: true },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    // Verify parent has access to this child
    await this.findOne(milestone.childId, parentId);

    return this.prisma.milestone.delete({
      where: { id: milestoneId },
    });
  }

  // Document management
  async createDocument(childId: string, createDocumentDto: CreateDocumentDto, parentId: string) {
    // Verify parent has access to this child
    await this.findOne(childId, parentId);

    return this.prisma.document.create({
      data: {
        title: createDocumentDto.title,
        description: createDocumentDto.description,
        fileUrl: createDocumentDto.fileUrl,
        fileType: createDocumentDto.fileType,
        fileSize: createDocumentDto.fileSize,
        childId,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getDocuments(childId: string, parentId: string) {
    // Verify parent has access to this child
    await this.findOne(childId, parentId);

    return this.prisma.document.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteDocument(documentId: string, parentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { child: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Verify parent has access to this child
    await this.findOne(document.childId, parentId);

    return this.prisma.document.delete({
      where: { id: documentId },
    });
  }

  // File upload
  async uploadFile(childId: string, file: Express.Multer.File, metadata: { title: string; description?: string }, parentId: string) {
    // Verify parent has access to this child
    await this.findOne(childId, parentId);

    const fileUrl = `/uploads/${file.filename}`;

    return this.prisma.document.create({
      data: {
        title: metadata.title,
        description: metadata.description,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        childId,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
