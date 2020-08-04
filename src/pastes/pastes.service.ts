import { Injectable } from '@nestjs/common';
import {
  Paste,
  PasteOrderByInput,
  PasteWhereInput,
  PasteWhereUniqueInput,
} from '@prisma/client';
import moment from 'moment';
import shortid from 'shortid';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePasteDto } from './dto/create-paste.dto';
import { UpdatePasteDto } from './dto/update-paste.dto';

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

  async createPaste(data: CreatePasteDto) {
    return this.prisma.paste.create({
      data: {
        ...data,
        date: new Date(),
        shortId: shortid.generate(),
        expiresIn: data.expiresIn
          ? moment()
              .add(data.expiresIn, 'm')
              .toDate()
          : null,
      },
    });
  }

  async updatePaste(where: PasteWhereUniqueInput, data: UpdatePasteDto) {
    return this.prisma.paste.update({
      where,
      data: {
        ...data,
        expiresIn: data.expiresIn
          ? moment()
              .add(data.expiresIn, 'm')
              .toDate()
          : null,
      },
    });
  }

  async deletePaste(where: PasteWhereUniqueInput) {
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
