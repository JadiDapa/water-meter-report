import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateComplaintDTO,
  UpdateComplaintDTO,
  ResolveComplaintDTO,
} from "../validators/complaint.validator";
import { uploadImage } from "@/lib/cloudinary";

export type ComplaintListOptions = {
  page?: number;
  pageSize?: number;
  customerId?: number;
  location?: string;
  orderBy?: Prisma.ComplaintOrderByWithRelationInput;
};

function complaintWhere(
  opts: ComplaintListOptions,
): Prisma.ComplaintWhereInput {
  const and: Prisma.ComplaintWhereInput[] = [];

  if (opts.customerId) and.push({ customerId: opts.customerId });
  if (opts.location) and.push({ location: opts.location });

  return and.length ? { AND: and } : {};
}

export const ComplaintService = {
  async list(opts: ComplaintListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = complaintWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "asc" };

    const [items, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.complaint.findMany({
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
    return await prisma.complaint.findMany({
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
    return await prisma.complaint.findMany({
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
    const complaint = await prisma.complaint.findUnique({
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

    return complaint;
  },

  async create(data: CreateComplaintDTO, images: File[] = []) {
    const imageRecords: { url: string; filename: string; size: number }[] = [];

    for (const file of images) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { url, publicId } = await uploadImage(buffer, "water-meter/complaints");
      imageRecords.push({ url, filename: publicId, size: file.size });
    }

    const complaint = await prisma.complaint.create({
      data: {
        ...data,
        images: {
          createMany: {
            data: imageRecords,
          },
        },
      },
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

    return complaint;
  },

  async update(id: number, data: UpdateComplaintDTO) {
    return prisma.complaint.update({ where: { id }, data });
  },

  async resolve(id: number, dto: ResolveComplaintDTO) {
    return prisma.complaint.update({
      where: { id },
      data: {
        status: dto.action,
        cancellationReason: dto.action === "CANCELLED" ? dto.cancellationReason : null,
        resolvedAt: new Date(),
      },
    });
  },

  async countPending() {
    return prisma.complaint.count({ where: { status: "PENDING" } });
  },

  async countPendingByTechnicianId(technicianId: number) {
    return prisma.complaint.count({ where: { status: "PENDING", technicianId } });
  },

  async delete(id: number) {
    return prisma.complaint.delete({ where: { id } });
  },
};
