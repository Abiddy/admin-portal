import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { persistResultPdf, resultPdfStoragePath } from "../src/lib/result-storage";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderMessage.deleteMany();
  await prisma.orderStatusEvent.deleteMany();
  await prisma.result.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.practice.deleteMany();

  const passwordHash = await hash("demo1234", 10);

  const practice = await prisma.practice.create({
    data: { name: "Demo Medical Group" },
  });

  const lab = await prisma.user.create({
    data: {
      email: "lab@bdl.com",
      passwordHash,
      name: "Lab Admin",
      role: "LAB_ADMIN",
      practiceId: null,
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: "doctor@demo.com",
      passwordHash,
      name: "Dr. Stephen Conley",
      role: "DOCTOR",
      practiceId: practice.id,
    },
  });

  const order1 = await prisma.order.create({
    data: {
      practiceId: practice.id,
      submittedById: doctor.id,
      status: "SUBMITTED",
      patientName: "Jane Cooper",
      patientPhone: "510-501-1245",
      patientEmail: "jane@email.com",
      notes: "Routine panel",
    },
  });

  await prisma.orderStatusEvent.create({
    data: {
      orderId: order1.id,
      status: "SUBMITTED",
      actorUserId: doctor.id,
      note: "Requisition submitted",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      practiceId: practice.id,
      submittedById: doctor.id,
      status: "RESULTS_READY",
      patientName: "Sarah G.",
      patientPhone: "415-555-0100",
      patientEmail: "sarah@email.com",
    },
  });

  const t0 = new Date("2025-03-01T10:00:00Z");
  const t1 = new Date("2025-03-02T14:00:00Z");
  const t2 = new Date("2025-03-05T09:30:00Z");
  const t3 = new Date("2025-03-08T16:00:00Z");

  await prisma.orderStatusEvent.createMany({
    data: [
      {
        orderId: order2.id,
        status: "SUBMITTED",
        actorUserId: doctor.id,
        note: "Requisition submitted",
        createdAt: t0,
      },
      {
        orderId: order2.id,
        status: "KIT_RECEIVED",
        actorUserId: lab.id,
        note: "Specimen received at lab",
        createdAt: t1,
      },
      {
        orderId: order2.id,
        status: "PROCESSING",
        actorUserId: lab.id,
        createdAt: t2,
      },
      {
        orderId: order2.id,
        status: "RESULTS_READY",
        actorUserId: lab.id,
        note: "Final report uploaded",
        createdAt: t3,
      },
    ],
  });

  const demoResult = await prisma.result.create({
    data: {
      orderId: order2.id,
      fileName: "results-sarah-g.pdf",
      fileKey: "__pending__",
      uploadedById: lab.id,
    },
  });
  const relKey = resultPdfStoragePath(demoResult.id);
  const demoPdf = Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n180\n%%EOF\n",
  );
  await persistResultPdf(relKey, demoPdf);
  await prisma.result.update({
    where: { id: demoResult.id },
    data: { fileKey: relKey },
  });

  await prisma.orderMessage.create({
    data: {
      orderId: order1.id,
      userId: doctor.id,
      body: "Submitted requisition — please confirm kit shipment.",
    },
  });

  console.log("Seed OK. Log in with lab@bdl.com or doctor@demo.com — password: demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
