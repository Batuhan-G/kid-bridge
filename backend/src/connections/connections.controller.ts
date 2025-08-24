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
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('connections')
@UseGuards(JwtAuthGuard)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('invite')
  invite(@Body() createConnectionDto: CreateConnectionDto, @Request() req) {
    return this.connectionsService.invite(createConnectionDto, req.user.email);
  }

  @Get('pending')
  getPending(@Request() req) {
    return this.connectionsService.getPending(req.user.email);
  }

  @Get('sent')
  getSent(@Request() req) {
    return this.connectionsService.getSent(req.user.email);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Request() req) {
    return this.connectionsService.updateConnection(
      id,
      { status: 'ACCEPTED' },
      req.user.email,
    );
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Request() req) {
    return this.connectionsService.updateConnection(
      id,
      { status: 'REJECTED' },
      req.user.email,
    );
  }

  @Get('status')
  getConnectionStatus(@Request() req) {
    return this.connectionsService.getConnectionStatus(req.user.email);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.connectionsService.removeConnection(id, req.user.email);
  }

  @Delete('sent/:id')
  cancelInvitation(@Param('id') id: string, @Request() req) {
    return this.connectionsService.cancelInvitation(id, req.user.email);
  }
}
