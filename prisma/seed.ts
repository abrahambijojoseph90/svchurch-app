import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Super Admin User ──────────────────────────────────────
  const hashedPassword = await bcrypt.hash("SVC@admin2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@svchurch.co.uk" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@svchurch.co.uk",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      active: true,
    },
  });
  console.log("Admin user created:", admin.email);

  // ─── Leaders ───────────────────────────────────────────────
  const leaders = [
    {
      name: "Thomas Samuel & Praisy Samuel",
      role: "Pastor & Wife",
      bio: "Leading Spring Valley Church with a heart for worship, discipleship, and community transformation.",
      image: "/images/leadership/church3-priests-pic1.jpg",
      order: 1,
    },
    {
      name: "Simon Varghese",
      role: "Treasurer",
      bio: "Serving the church with integrity and faithfulness in stewardship and financial oversight.",
      image: "/images/leadership/church3-priests-pic2.jpg",
      order: 2,
    },
    {
      name: "Bijo Abraham",
      role: "Trustee",
      bio: "Supporting the church's mission through governance, outreach, and community engagement.",
      image: "/images/leadership/church3-priests-pic3.jpg",
      order: 3,
      socials: { facebook: "#", instagram: "#", youtube: "#" },
    },
  ];

  for (const leader of leaders) {
    await prisma.leader.create({ data: leader });
  }
  console.log("Leaders created:", leaders.length);

  // ─── Ministries ────────────────────────────────────────────
  const ministries = [
    {
      name: "Kid's Club",
      subtitle: "For children under 12",
      description: "Teaching the word of God with games and engaging activities, fostering a fun environment for spiritual growth.",
      schedule: "Every Second Saturday of the Month",
      icon: "Baby",
      order: 1,
      image: "/images/ministries/church3-ministry-pic1.jpg",
    },
    {
      name: "Prayer Meetings",
      subtitle: "Prayer and Spiritual Encounters",
      description: "Monthly gatherings where the church comes together in prayer and worship, seeking God's presence.",
      schedule: "Last Week of Every Month",
      icon: "HandHeart",
      order: 2,
      image: "/images/ministries/church3-ministry-pic2.jpg",
    },
    {
      name: "SVC Students and Twentees",
      subtitle: "For ages 15-30",
      description: "A dynamic space for young people navigating faith, identity and purpose through discussions and fellowship.",
      schedule: "Every Second Tuesday of the Month",
      location: "Hightown Methodist Church",
      icon: "GraduationCap",
      order: 3,
      image: "/images/ministries/church3-ministry-pic3.jpg",
    },
    {
      name: "SVC Women's Fellowship",
      subtitle: "In partnership with sisters",
      description: "Bible study, worship, and encouragement. Supporting those in need through mentorship and outreach.",
      schedule: "Monthly (Date TBA)",
      icon: "Heart",
      order: 4,
      image: "/images/ministries/church3-ministry-pic4.jpg",
    },
    {
      name: "SVC Men's Fellowship",
      subtitle: "For the men of the church",
      description: "Fellowship, honest discussions and encouragement. Outdoor gatherings, social events, and community work.",
      schedule: "Monthly (Date TBA)",
      icon: "Shield",
      order: 5,
      image: "/images/ministries/church3-ministry-pic5.jpg",
    },
    {
      name: "SVC Missions",
      subtitle: "The Great Commission",
      description: "The heartbeat of our church. We believe every believer is called to be a witness for Christ.",
      schedule: "Ongoing",
      icon: "Globe",
      order: 6,
      image: "/images/ministries/church3-ministry-pic6.jpg",
    },
  ];

  for (const ministry of ministries) {
    await prisma.ministry.create({ data: ministry });
  }
  console.log("Ministries created:", ministries.length);

  // ─── Blog Posts ────────────────────────────────────────────
  const posts = [
    {
      title: "To the Stranger and the Friend",
      slug: "to-the-stranger-and-the-friend",
      content: "A reflection on hospitality, grace, and the call to welcome both the stranger and the friend.",
      excerpt: "A reflection on hospitality and grace.",
      authorId: admin.id,
      image: "/images/church3-home-pic1.jpg",
      published: true,
      publishedAt: new Date("2025-07-01"),
    },
    {
      title: "Mary Magdalene After the Resurrection",
      slug: "mary-magdalene-after-the-resurrection",
      content: "Exploring the encounter between Mary Magdalene and the risen Christ.",
      excerpt: "The encounter with the risen Christ.",
      authorId: admin.id,
      image: "/images/church3-home-pic4.jpg",
      published: true,
      publishedAt: new Date("2025-06-15"),
    },
    {
      title: "Factors That Help Us to Know God",
      slug: "factors-that-help-us-to-know-god",
      content: "Key factors that deepen our relationship with God — prayer, scripture, community, and surrender.",
      excerpt: "Key factors that deepen our relationship with God.",
      authorId: admin.id,
      image: "/images/church3-home-pic5.jpg",
      published: true,
      publishedAt: new Date("2025-06-01"),
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log("Blog posts created:", posts.length);

  // ─── Gallery Images ────────────────────────────────────────
  for (let i = 1; i <= 18; i++) {
    await prisma.galleryImage.create({
      data: {
        src: `/images/gallery/church3-gallery-pic${i}.jpg`,
        caption: `Church life — image ${i}`,
        order: i,
      },
    });
  }
  console.log("Gallery images created: 18");

  // ─── Site Settings ─────────────────────────────────────────
  const settings = [
    { key: "phone", value: "0330 088 9669" },
    { key: "email", value: "admin@svchurch.co.uk" },
    { key: "address", value: "49 High Town Rd, Luton LU2 0BW, United Kingdom" },
    { key: "sunday_service_time", value: "08:15 AM - 10:30 AM" },
    { key: "sunday_school_time", value: "11:00 AM - 12:00 PM" },
    { key: "friday_study_time", value: "08:00 PM - 10:00 PM" },
    { key: "giving_url", value: "https://www.stewardship.org.uk/partners/SpringValleyChurchLuton" },
    { key: "facebook_url", value: "#" },
    { key: "instagram_url", value: "#" },
    { key: "youtube_url", value: "#" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Site settings created:", settings.length);

  console.log("\nSeed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
