import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../validators/customer.validator";

export type CustomerListOptions = {
  page?: number;
  pageSize?: number;
  userId?: number;
  customerId?: string;
  fullname?: string;
  phoneNumber?: string;
  address?: string;
  buildingSlug?: string;
  orderBy?: Prisma.CustomerOrderByWithRelationInput;
};

function customerWhere(opts: CustomerListOptions): Prisma.CustomerWhereInput {
  const and: Prisma.CustomerWhereInput[] = [];

  if (opts.userId) and.push({ userId: opts.userId });
  if (opts.customerId) and.push({ customerId: opts.customerId });
  if (opts.fullname) and.push({ fullname: opts.fullname });
  if (opts.phoneNumber) and.push({ phoneNumber: opts.phoneNumber });
  if (opts.address) and.push({ address: opts.address });
  if (opts.buildingSlug) and.push({ buildingSlug: opts.buildingSlug });

  return and.length ? { AND: and } : {};
}

export const CustomerService = {
  async list(opts: CustomerListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = customerWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.customer.findMany({
      include: {
        complaints: {
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          select: { id: true },
        },
        reports: {
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          select: { id: true },
        },
      },
    });
  },

  async getByBuildingSlug(buildingSlug: string) {
    return await prisma.customer.findMany({
      where: { buildingSlug },
      include: {
        reports: true,
        complaints: true,
        bulding: true,
      },
    });
  },

  async getById(id: number) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        reports: true,
        complaints: true,
        bulding: true,
      },
    });
  },

  async create(data: CreateCustomerDTO & { userId: number }) {
    return prisma.customer.create({ data });
  },

  async update(id: number, data: UpdateCustomerDTO) {
    return prisma.customer.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.customer.delete({ where: { id } });
  },
};
