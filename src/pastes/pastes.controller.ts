import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePasteDto } from './dto/create-paste.dto';
import { UpdatePasteDto } from './dto/update-paste.dto';
import { PastesService } from './pastes.service';

@Controller('pastes')
export class PastesController {
  constructor(private readonly pasteService: PastesService) {}

  @Get(':id')
  getPasteById(@Param('id') shortId: string) {
    return this.pasteService.paste({ shortId });
  }

  @Get('recent')
  getPublicPastes() {
    return this.pasteService.pastes({
      take: 10,
      orderBy: { date: 'desc' },
      where: { exposure: 'PUBLIC', expiresIn: { gte: new Date() } },
    });
  }

  @Post()
  addPaste(@Body() data: CreatePasteDto) {
    // TODO: Add author if exists
    return this.pasteService.createPaste({ ...data, author: null } as any);
  }

  @Patch(':id')
  changePaste(@Param('id') shortId: string, @Body() data: UpdatePasteDto) {
    // TODO: Check if user === paste.author
    return this.pasteService.updatePaste({ shortId }, data);
  }
}
