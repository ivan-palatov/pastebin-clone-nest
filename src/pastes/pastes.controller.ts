import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Exposure } from '@prisma/client';
import { ApplyUser } from 'src/auth/guards/apply-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreatePasteDto } from './dto/create-paste.dto';
import { UpdatePasteDto } from './dto/update-paste.dto';
import { PastesService } from './pastes.service';

@Controller('pastes')
export class PastesController {
  constructor(private readonly pasteService: PastesService) {}

  @Get('recent')
  getPublicPastes() {
    return this.pasteService.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      where: { exposure: Exposure.PUBLIC, expiresIn: { gte: new Date() } },
    });
  }

  @Get('/id/:id')
  getPasteById(@Param('id') shortId: string) {
    return this.pasteService.findOne({ shortId });
  }

  @Post()
  @UseGuards(ApplyUser)
  addPaste(@Body() data: CreatePasteDto, @CurrentUser('id') id: number) {
    return this.pasteService.createPaste(data, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  changePaste(
    @Param('id') shortId: string,
    @Body() data: UpdatePasteDto,
    @CurrentUser('id') id: number,
  ) {
    return this.pasteService.updatePaste({ shortId }, data, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePaste(@Param('id') shortId: string, @CurrentUser('id') id: number) {
    return this.pasteService.deletePaste({ shortId }, id);
  }
}
