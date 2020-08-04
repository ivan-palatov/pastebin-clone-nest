import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
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
  addPaste(@Body() data: CreatePasteDto, @CurrentUser('id') id: number) {
    return this.pasteService.createPaste({ ...data }, id);
  }

  @Patch(':id')
  // TODO: Check if authorized
  changePaste(
    @Param('id') shortId: string,
    @Body() data: UpdatePasteDto,
    @CurrentUser('id') id: number,
  ) {
    return this.pasteService.updatePaste({ shortId }, data, id);
  }
}
