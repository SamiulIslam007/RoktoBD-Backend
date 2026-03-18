import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const TEST_PASSWORD = "password123";
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DISTRICTS = [
  { name: "Dhaka", nameBn: "ঢাকা" },
  { name: "Faridpur", nameBn: "ফরিদপুর" },
  { name: "Gazipur", nameBn: "গাজীপুর" },
  { name: "Gopalganj", nameBn: "গোপালগঞ্জ" },
  { name: "Kishoreganj", nameBn: "কিশোরগঞ্জ" },
  { name: "Madaripur", nameBn: "মাদারীপুর" },
  { name: "Manikganj", nameBn: "মানিকগঞ্জ" },
  { name: "Munshiganj", nameBn: "মুন্সিগঞ্জ" },
  { name: "Narayanganj", nameBn: "নারায়ণগঞ্জ" },
  { name: "Narsingdi", nameBn: "নরসিংদী" },
  { name: "Netrokona", nameBn: "নেত্রকোণা" },
  { name: "Rajbari", nameBn: "রাজবাড়ী" },
  { name: "Shariatpur", nameBn: "শরীয়তপুর" },
  { name: "Tangail", nameBn: "টাঙ্গাইল" },
  { name: "Bogura", nameBn: "বগুড়া" },
  { name: "Joypurhat", nameBn: "জয়পুরহাট" },
  { name: "Naogaon", nameBn: "নওগাঁ" },
  { name: "Natore", nameBn: "নাটোর" },
  { name: "Chapainawabganj", nameBn: "চাপাইনবাবগঞ্জ" },
  { name: "Pabna", nameBn: "পাবনা" },
  { name: "Rajshahi", nameBn: "রাজশাহী" },
  { name: "Sirajganj", nameBn: "সিরাজগঞ্জ" },
  { name: "Bagerhat", nameBn: "বাগেরহাট" },
  { name: "Chuadanga", nameBn: "চুয়াডাঙ্গা" },
  { name: "Jessore", nameBn: "যশোর" },
  { name: "Jhenaidah", nameBn: "ঝিনাইদহ" },
  { name: "Khulna", nameBn: "খুলনা" },
  { name: "Kushtia", nameBn: "কুষ্টিয়া" },
  { name: "Magura", nameBn: "মাগুরা" },
  { name: "Meherpur", nameBn: "মেহেরপুর" },
  { name: "Narail", nameBn: "নড়াইল" },
  { name: "Satkhira", nameBn: "সাতক্ষীরা" },
  { name: "Bandarban", nameBn: "বান্দরবান" },
  { name: "Brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া" },
  { name: "Chandpur", nameBn: "চাঁদপুর" },
  { name: "Chittagong", nameBn: "চট্টগ্রাম" },
  { name: "Comilla", nameBn: "কুমিল্লা" },
  { name: "Cox's Bazar", nameBn: "কক্সবাজার" },
  { name: "Feni", nameBn: "ফেনী" },
  { name: "Khagrachhari", nameBn: "খাগড়াছড়ি" },
  { name: "Lakshmipur", nameBn: "লক্ষ্মীপুর" },
  { name: "Noakhali", nameBn: "নোয়াখালী" },
  { name: "Rangamati", nameBn: "রাঙ্গামাটি" },
  { name: "Habiganj", nameBn: "হবিগঞ্জ" },
  { name: "Moulvibazar", nameBn: "মৌলভীবাজার" },
  { name: "Sunamganj", nameBn: "সুনামগঞ্জ" },
  { name: "Sylhet", nameBn: "সিলেট" },
  { name: "Barguna", nameBn: "বরগুনা" },
  { name: "Barisal", nameBn: "বরিশাল" },
  { name: "Bhola", nameBn: "ভোলা" },
  { name: "Jhalokati", nameBn: "ঝালকাঠি" },
  { name: "Patuakhali", nameBn: "পটুয়াখালী" },
  { name: "Pirojpur", nameBn: "পিরোজপুর" },
  { name: "Dinajpur", nameBn: "দিনাজপুর" },
  { name: "Gaibandha", nameBn: "গাইবান্ধা" },
  { name: "Kurigram", nameBn: "কুড়িগ্রাম" },
  { name: "Lalmonirhat", nameBn: "লালমনিরহাট" },
  { name: "Nilphamari", nameBn: "নিলফামারী" },
  { name: "Panchagarh", nameBn: "পঞ্চগড়" },
  { name: "Rangpur", nameBn: "রংপুর" },
  { name: "Thakurgaon", nameBn: "ঠাকুরগাঁও" },
  { name: "Jamalpur", nameBn: "জামালপুর" },
  { name: "Mymensingh", nameBn: "ময়মনসিংহ" },
  { name: "Sherpur", nameBn: "শেরপুর" },
] as const;

async function main() {
  console.log("Seeding database...");

  const TEST_USERS = [
    { phone: "01710000001", name: "Test Donor", role: "DONOR" as const },
    { phone: "01710000002", name: "Test Requester", role: "REQUESTER" as const },
    { phone: "01710000003", name: "Test Hospital", role: "HOSPITAL" as const },
    { phone: "01710000004", name: "Test Admin", role: "ADMIN" as const },
    { phone: "01710000005", name: "Test User 5", role: "REQUESTER" as const },
  ];

  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const u of TEST_USERS) {
    const existing = await prisma.user.findUnique({ where: { phone: u.phone } });
    if (!existing) {
      await prisma.user.create({
        data: {
          phone: u.phone,
          name: u.name,
          role: u.role,
          password: hashedPassword,
        },
      });
      console.log(`  ✓ Test User: ${u.name} (${u.phone}) — ${u.role}`);
    } else if (!existing.password) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword },
      });
      console.log(`  ✓ Updated password for: ${u.name} (${u.phone})`);
    }
  }

  for (const d of DISTRICTS) {
    const existing = await prisma.district.findFirst({
      where: { name: d.name },
    });
    if (!existing) {
      await prisma.district.create({
        data: {
          name: d.name,
          nameBn: d.nameBn,
        },
      });
      console.log(`  ✓ District: ${d.name} (${d.nameBn})`);
    }
  }

  const dhakaDistrict = await prisma.district.findFirst({
    where: { name: "Dhaka" },
  });
  if (dhakaDistrict) {
    const dhakaCities = [
      { name: "Dhanmondi", nameBn: "ধানমন্ডি" },
      { name: "Gulshan", nameBn: "গুলশান" },
      { name: "Mohakhali", nameBn: "মোহাখালী" },
      { name: "Uttara", nameBn: "উত্তরা" },
      { name: "Motijheel", nameBn: "মতিঝিল" },
    ];
    for (const c of dhakaCities) {
      const existing = await prisma.city.findFirst({
        where: { districtId: dhakaDistrict.id, name: c.name },
      });
      if (!existing) {
        await prisma.city.create({
          data: {
            districtId: dhakaDistrict.id,
            name: c.name,
            nameBn: c.nameBn,
          },
        });
        console.log(`  ✓ City: ${c.name} (${c.nameBn}) — Dhaka`);
      }
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
