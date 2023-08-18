import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findUnique({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    await this.findAndVerifyBookmark(userId, bookmarkId);

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: dto,
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    await this.findAndVerifyBookmark(userId, bookmarkId);

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  private async findAndVerifyBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');
  }
}
