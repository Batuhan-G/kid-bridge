import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(createMessageDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: GetMessagesQueryDto, @Request() req) {
    return this.messagesService.findAll(req.user.id, query);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }

  @Get('conversation/:otherUserId/:childId')
  getConversation(
    @Param('otherUserId') otherUserId: string,
    @Param('childId') childId: string,
    @Request() req,
  ) {
    return this.messagesService.getConversation(
      req.user.id,
      otherUserId,
      childId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.messagesService.findOne(id, req.user.id);
  }

  @Patch('mark-all-read')
  markAllAsRead(@Query('childId') childId: string, @Request() req) {
    return this.messagesService.markAllAsRead(req.user.id, childId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ) {
    return this.messagesService.update(id, updateMessageDto, req.user.id);
  }
}
