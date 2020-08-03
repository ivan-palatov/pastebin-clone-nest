import { Injectable } from '@nestjs/common';
import {
  Paste,
  PasteCreateInput,
  PasteOrderByInput,
  PasteUpdateInput,
  PasteWhereInput,
  PasteWhereUniqueInput,
} from '@prisma/client';
import shortid from 'shortid';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PastesService {
  constructor(private readonly prisma: PrismaService) {}

  async paste(where: PasteWhereUniqueInput): Promise<Paste | null> {
    return this.prisma.paste.findOne({
      where,
    });
  }

  async pastes(params: {
    skip?: number;
    take?: number;
    cursor?: PasteWhereUniqueInput;
    where?: PasteWhereInput;
    orderBy?: PasteOrderByInput;
  }) {
    return this.prisma.paste.findMany(params);
  }

  async createPaste(data: PasteCreateInput) {
    return this.prisma.paste.create({
      data: {
        ...data,
        date: new Date(),
        shortId: shortid.generate(),
        author: {
          connect: { email: 'haha' }, // TODO: add actual author, but only if its not asGuest
        },
      },
    });
  }

  async updatePaste(params: {
    where: PasteWhereUniqueInput;
    data: PasteUpdateInput;
  }) {
    // TODO: check if it is author who updates it
    return this.prisma.paste.update(params);
  }

  async deletePaste(where: PasteWhereUniqueInput) {
    // TODO: check if it was created by the one who deletes it
    return this.prisma.paste.delete({
      where,
    });
  }

  async removeExpired() {
    this.prisma.paste.deleteMany({
      where: {
        AND: [{ expiresIn: { not: null } }, { expiresIn: { lte: new Date() } }],
      },
    });
  }
}
