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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
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

  // Milestone endpoints
  @Post(':id/milestones')
  createMilestone(
    @Param('id') childId: string,
    @Body() createMilestoneDto: CreateMilestoneDto,
    @Request() req,
  ) {
    return this.childrenService.createMilestone(childId, createMilestoneDto, req.user.id);
  }

  @Get(':id/milestones')
  getMilestones(@Param('id') childId: string, @Request() req) {
    return this.childrenService.getMilestones(childId, req.user.id);
  }

  @Patch('milestones/:milestoneId')
  updateMilestone(
    @Param('milestoneId') milestoneId: string,
    @Body() updateData: Partial<CreateMilestoneDto>,
    @Request() req,
  ) {
    return this.childrenService.updateMilestone(milestoneId, updateData, req.user.id);
  }

  @Delete('milestones/:milestoneId')
  deleteMilestone(@Param('milestoneId') milestoneId: string, @Request() req) {
    return this.childrenService.deleteMilestone(milestoneId, req.user.id);
  }

  // Document endpoints
  @Post(':id/documents')
  createDocument(
    @Param('id') childId: string,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req,
  ) {
    return this.childrenService.createDocument(childId, createDocumentDto, req.user.id);
  }

  @Get(':id/documents')
  getDocuments(@Param('id') childId: string, @Request() req) {
    return this.childrenService.getDocuments(childId, req.user.id);
  }

  @Delete('documents/:documentId')
  deleteDocument(@Param('documentId') documentId: string, @Request() req) {
    return this.childrenService.deleteDocument(documentId, req.user.id);
  }

  // File upload endpoint
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        
        if (extName && mimeType) {
          return cb(null, true);
        } else {
          cb(new Error('Only images and documents are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  uploadFile(
    @Param('id') childId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req,
  ) {
    return this.childrenService.uploadFile(childId, file, { title, description }, req.user.id);
  }
}
