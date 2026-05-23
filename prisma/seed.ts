import { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Starting seed...\n");

  // ─── Buildings ────────────────────────────────────────────────────────────
  const buildingData = [
    {
      slug: "rumah",
      name: "Rumah",
      description: "Hunian residensial / rumah tinggal",
    },
    {
      slug: "apartemen",
      name: "Apartemen",
      description: "Unit apartemen dan kondominium",
    },
    { slug: "ruko", name: "Ruko", description: "Rumah toko (ruko) komersial" },
    { slug: "kantor", name: "Kantor", description: "Gedung perkantoran" },
    {
      slug: "pabrik",
      name: "Pabrik",
      description: "Kawasan industri dan pabrik",
    },
  ];

  for (const b of buildingData) {
    await prisma.building.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }
  console.log(`✅ Buildings seeded (${buildingData.length})`);

  // ─── Users ────────────────────────────────────────────────────────────────
  // IMPORTANT: Usernames must match Clerk account usernames exactly.
  const userData = [
    { name: "Administrator", username: "administrator", role: UserRole.ADMIN },
    { name: "Tech One", username: "techone", role: UserRole.TECHNICIAN },
    { name: "Customer One", username: "customerone", role: UserRole.CUSTOMER },
  ];

  for (const u of userData) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    });
  }
  console.log(`✅ Users seeded (${userData.length})`);

  // ─── Technician ───────────────────────────────────────────────────────────
  const techUser = await prisma.user.findUnique({
    where: { username: "techone" },
  });

  await prisma.technician.upsert({
    where: { userId: techUser!.id },
    update: {},
    create: {
      userId: techUser!.id,
      fullname: "Tech One",
      phoneNumber: "081234567890",
      region: "Palembang",
    },
  });
  console.log("✅ Technician seeded (1)");

  // ─── Customer ─────────────────────────────────────────────────────────────
  const custUser = await prisma.user.findUnique({
    where: { username: "customerone" },
  });

  await prisma.customer.upsert({
    where: { customerId: "PLG-001" },
    update: {},
    create: {
      userId: custUser!.id,
      customerId: "PLG-001",
      fullname: "Customer One",
      phoneNumber: "081298765432",
      address: "Jl. Sudirman No. 1, Palembang",
      buildingSlug: "rumah",
    },
  });
  console.log("✅ Customer seeded (1)");

  console.log(`
────────────────────────────────────────
✅ Seed complete!

⚠️  Make sure these Clerk accounts exist
    with matching usernames:

    admin       → ADMIN
    techone     → TECHNICIAN
    customerone → CUSTOMER
────────────────────────────────────────
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
