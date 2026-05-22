import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateBuildingDTO,
  UpdateBuildingDTO,
} from "../validators/building.validator";

export type BuildingListOptions = {
  page?: number;
  pageSize?: number;
  userId?: number;
  slug?: string;
  name?: string;
  search?: string;
  orderBy?: Prisma.BuildingOrderByWithRelationInput;
};

function buildingWhere(opts: BuildingListOptions): Prisma.BuildingWhereInput {
  const and: Prisma.BuildingWhereInput[] = [];

  if (opts.slug) and.push({ slug: opts.slug });
  if (opts.name) and.push({ name: opts.name });

  return and.length ? { AND: and } : {};
}

export const BuildingService = {
  async list(opts: BuildingListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = buildingWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "asc" };

    const [items, total] = await Promise.all([
      prisma.building.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.building.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.building.findMany({
      include: {
        customers: true,
      },
    });
  },

  async getById(id: number) {
    return await prisma.building.findUnique({
      where: { id },
    });
  },

  async getBySlug(slug: string) {
    return await prisma.building.findUnique({
      where: { slug },
    });
  },

  async create(data: CreateBuildingDTO) {
    return prisma.building.create({ data });
  },

  async update(id: number, data: UpdateBuildingDTO) {
    return prisma.building.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.building.delete({ where: { id } });
  },
};
