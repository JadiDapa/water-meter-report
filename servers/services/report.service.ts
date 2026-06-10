import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateReportDTO,
  UpdateReportDTO,
} from "../validators/report.validator";
import { uploadImage } from "@/lib/cloudinary";

export type ReportListOptions = {
  page?: number;
  pageSize?: number;
  userId?: number;
  technicianId?: number;
  customerId?: number;
  location?: string;
  values?: string;
  search?: string;
  orderBy?: Prisma.ReportOrderByWithRelationInput;
};

function buildingWhere(opts: ReportListOptions): Prisma.ReportWhereInput {
  const and: Prisma.ReportWhereInput[] = [];

  if (opts.technicianId) and.push({ technicianId: opts.technicianId });
  if (opts.customerId) and.push({ customerId: opts.customerId });
  if (opts.location) and.push({ location: opts.location });
  if (opts.values) and.push({ values: opts.values });

  return and.length ? { AND: and } : {};
}

export const ReportService = {
  async list(opts: ReportListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = buildingWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "asc" };

    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.report.findMany({
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        technician: {
          include: {
            user: true,
          },
        },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getByCustomerId(customerId: number) {
    return await prisma.report.findMany({
      where: { customerId },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        technician: {
          include: {
            user: true,
          },
        },
        images: true,
      },
    });
  },
  async getByTechnicianId(technicianId: number) {
    return await prisma.report.findMany({
      where: { technicianId },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        technician: {
          include: {
            user: true,
          },
        },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async getById(id: number) {
    return await prisma.report.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        technician: {
          include: {
            user: true,
          },
        },
        images: true,
      },
    });
  },

  async create(data: CreateReportDTO, images: File[] = []) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const existing = await prisma.report.findFirst({
      where: {
        customerId: data.customerId,
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    });

    if (existing) {
      const label = now.toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      });
      throw new Error(
        `Laporan untuk pelanggan ini sudah ada pada bulan ${label}`,
      );
    }

    const imageRecords: { url: string; filename: string; size: number }[] = [];

    for (const file of images) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { url, publicId } = await uploadImage(buffer, "water-meter/reports");
      imageRecords.push({ url, filename: publicId, size: file.size });
    }

    const report = await prisma.report.create({
      data: {
        ...data,
        images: {
          createMany: {
            data: imageRecords,
          },
        },
      },
      include: { images: true },
    });

    return report;
  },

  async update(id: number, data: UpdateReportDTO) {
    return prisma.report.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.report.delete({ where: { id } });
  },
};
