import { Controller, Get, Param } from '@nestjs/common';
import { PastesService } from './pastes.service';

@Controller('pastes')
export class PastesController {
  constructor(private readonly pasteService: PastesService) {}

  @Get('paste/:id')
  getPasteById(@Param('id') shortId: string) {
    return this.pasteService.paste({ shortId });
  }

  @Get('pastes')
  getPublicPastes() {
    return this.pasteService.pastes({
      take: 10,
      orderBy: { date: 'desc' },
      where: { exposure: 'PUBLIC', expiresIn: { gte: new Date() } },
    });
  }
}
