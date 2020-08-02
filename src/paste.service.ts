import { Injectable } from '@nestjs/common';
import {
  Paste,
  PasteCreateInput,
  PasteOrderByInput,
  PasteUpdateInput,
  PasteWhereInput,
  PasteWhereUniqueInput,
} from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class PasteService {
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
      data,
    });
  }

  async updatePaste(params: {
    where: PasteWhereUniqueInput;
    data: PasteUpdateInput;
  }) {
    return this.prisma.paste.update(params);
  }

  async deletePaste(where: PasteWhereUniqueInput) {
    return this.prisma.paste.delete({
      where,
    });
  }
}
