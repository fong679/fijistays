import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVillageDto } from './dto/create-village.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class VillagesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateVillageDto) {
    return this.prisma.village.create({
      data: { ...dto, hostId: userId },
      include: { host: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  async findAll(filters?: { islandGroup?: string; verified?: boolean }) {
    return this.prisma.village.findMany({
      where: {
        isActive: true,
        ...(filters?.islandGroup && { islandGroup: filters.islandGroup as any }),
        ...(filters?.verified !== undefined && { isVerified: filters.verified }),
      },
      include: {
        images: { where: { isPrimary: true } },
        experiences: { where: { isActive: true }, select: { id: true, type: true, pricePerPerson: true } },
        protocols: { include: { protocol: true } },
        _count: { select: { experiences: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const village = await this.prisma.village.findUnique({
      where: { id, isActive: true },
      include: {
        host: { select: { id: true, firstName: true, lastName: true } },
        images: true,
        experiences: {
          where: { isActive: true },
          include: { images: { where: { isPrimary: true } } },
        },
        protocols: { include: { protocol: true } },
      },
    });
    if (!village) throw new NotFoundException('Village not found');
    return village;
  }

  async verify(id: string, adminId: string) {
    return this.prisma.village.update({
      where: { id },
      data: { isVerified: true, verifiedAt: new Date() },
    });
  }

  async findByHost(hostId: string) {
    return this.prisma.village.findMany({
      where: { hostId },
      include: {
        images: true,
        experiences: { include: { availability: true } },
        protocols: { include: { protocol: true } },
      },
    });
  }
}
