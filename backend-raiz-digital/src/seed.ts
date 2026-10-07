import { prisma } from './db';

async function main() {
  console.log('Seeding database...');

  // 1. Create Users
  const enfermero = await prisma.user.upsert({
    where: { email: 'enfermero@raizdigital.org' },
    update: {},
    create: {
      nombre: 'Enfermero Juan Pérez',
      email: 'enfermero@raizdigital.org',
      password: 'password123',
      rol: 'ENFERMERO',
    },
  });

  const familiar = await prisma.user.upsert({
    where: { email: 'familiar@raizdigital.org' },
    update: {},
    create: {
      nombre: 'María García (Familiar)',
      email: 'familiar@raizdigital.org',
      password: 'password123',
      rol: 'FAMILIAR',
    },
  });

  const residenteUser = await prisma.user.upsert({
    where: { email: 'residente@raizdigital.org' },
    update: {},
    create: {
      nombre: 'Don Roberto García',
      email: 'residente@raizdigital.org',
      password: 'password123',
      rol: 'RESIDENTE',
    },
  });

  // 2. Create Resident
  const resident = await prisma.resident.create({
    data: {
      nombre: 'Roberto',
      apellido: 'García',
      fechaNacimiento: '1945-05-12',
      habitacion: 'Habitación 104-A',
      estado: 'Estable',
      familiarId: familiar.id,
      usuarioId: residenteUser.id,
    },
  });

  console.log(`Created resident: ${resident.nombre} ${resident.apellido}`);

  // 3. Vital Signs
  await prisma.vitalSign.createMany({
    data: [
      {
        residentId: resident.id,
        presionArterial: '120/80',
        frecuenciaCardiaca: 72,
        temperatura: 36.6,
        saturacionOxigeno: 98,
        notas: 'Paciente de buen ánimo en la mañana.',
        registradoPorId: enfermero.id,
      },
      {
        residentId: resident.id,
        presionArterial: '125/82',
        frecuenciaCardiaca: 75,
        temperatura: 36.8,
        saturacionOxigeno: 97,
        notas: 'Toma de signos post-almuerzo.',
        registradoPorId: enfermero.id,
      },
    ],
  });

  // 4. Products / Inventory
  const prod1 = await prisma.product.create({
    data: {
      residentId: resident.id,
      nombre: 'Losartán 50mg',
      categoria: 'Medicamentos',
      cantidad: 3, // Low stock triggers alert
      stockMinimo: 5,
      unidadMedida: 'tabletas',
      fechaVencimiento: '2026-12-31',
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      residentId: resident.id,
      nombre: 'Pañales Adulto G',
      categoria: 'Higiene',
      cantidad: 20,
      stockMinimo: 10,
      unidadMedida: 'paquetes',
      fechaVencimiento: '2027-01-01',
    },
  });

  // 5. Recipe
  await prisma.recipe.create({
    data: {
      residentId: resident.id,
      diagnostico: 'Hipertensión Arterial Sistémica',
      medico: 'Dr. Alejandro Martínez',
      estado: 'ACTIVA',
      detalles: {
        create: [
          {
            medicamento: 'Losartán 50mg',
            dosis: '1 tableta',
            frecuencia: 'Cada 12 horas',
            duracion: '30 días',
          },
          {
            medicamento: 'Aspirina 100mg',
            dosis: '1 tableta',
            frecuencia: 'Cada 24 horas (Mañanas)',
            duracion: '30 días',
          },
        ],
      },
    },
  });

  // 6. Alerts
  await prisma.alert.create({
    data: {
      residentId: resident.id,
      productId: prod1.id,
      tipo: 'REABASTECIMIENTO',
      mensaje: 'Quedan solo 3 tabletas de Losartán 50mg. Se requiere reabastecer pronto.',
      atendida: false,
      enteradoFamiliar: false,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
