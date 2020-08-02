import { Controller, Get, Param } from '@nestjs/common';
import { PasteService } from './paste.service';
import { UserService } from './user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly pasteService: PasteService,
  ) {}

  @Get('paste/:id')
  getPasteById(@Param('id') id: string) {
    return this.pasteService.paste({ id: Number(id) });
  }

  @Get('pastes')
  getPublicPastes() {
    return this.pasteService.pastes({
      take: 10,
      orderBy: { date: 'desc' },
      where: { exposure: 'PUBLIC', expiresIn: { gte: new Date() } },
    });
  }

  @Get('u/:id/pastes')
  getUserPastes(@Param('id') id: string) {
    return this.pasteService.pastes({
      take: 20,
      orderBy: { date: 'desc' },
      where: {
        exposure: 'PUBLIC',
        expiresIn: { gte: new Date() },
        authorId: Number(id),
      },
    });
  }
}
