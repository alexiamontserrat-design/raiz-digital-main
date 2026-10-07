import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// AUTH ENDPOINTS
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({
      token: `fake-jwt-token-${user.id}`,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en inicio de sesión' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const user = await prisma.user.create({
      data: {
        nombre,
        email,
        password,
        rol: rol || 'ENFERMERO',
      },
    });

    res.status(201).json({
      token: `fake-jwt-token-${user.id}`,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// RESIDENTS ENDPOINTS
app.get('/api/residents', async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { nombre: { contains: String(search) } },
          { apellido: { contains: String(search) } },
          { habitacion: { contains: String(search) } },
        ],
      };
    }

    const residents = await prisma.resident.findMany({
      where: whereClause,
      include: {
        familiar: { select: { id: true, nombre: true, email: true } },
        _count: { select: { vitalSigns: true, products: true, recipes: true } },
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(residents);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener residentes' });
  }
});

app.get('/api/residents/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resident = await prisma.resident.findUnique({
      where: { id },
      include: {
        familiar: { select: { id: true, nombre: true, email: true } },
        vitalSigns: { orderBy: { fecha: 'desc' }, take: 10 },
        products: true,
        recipes: { include: { detalles: true }, orderBy: { fecha: 'desc' } },
        alerts: { orderBy: { fecha: 'desc' } },
      },
    });

    if (!resident) {
      return res.status(404).json({ error: 'Residente no encontrado' });
    }

    res.json(resident);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalle del residente' });
  }
});

app.post('/api/residents', async (req, res) => {
  try {
    const { nombre, apellido, fechaNacimiento, habitacion, familiarId } = req.body;
    const resident = await prisma.resident.create({
      data: {
        nombre,
        apellido,
        fechaNacimiento,
        habitacion,
        familiarId: familiarId ? parseInt(familiarId) : null,
      },
    });
    res.status(201).json(resident);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear residente' });
  }
});

// VITAL SIGNS ENDPOINTS
app.get('/api/residents/:id/vitals', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const vitals = await prisma.vitalSign.findMany({
      where: { residentId },
      orderBy: { fecha: 'desc' },
      include: { registradoPor: { select: { nombre: true } } },
    });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener signos vitales' });
  }
});

app.post('/api/residents/:id/vitals', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const { presionArterial, frecuenciaCardiaca, temperatura, saturacionOxigeno, notas, registradoPorId } = req.body;

    const vital = await prisma.vitalSign.create({
      data: {
        residentId,
        presionArterial,
        frecuenciaCardiaca: parseInt(frecuenciaCardiaca),
        temperatura: parseFloat(temperatura),
        saturacionOxigeno: parseInt(saturacionOxigeno),
        notas,
        registradoPorId: registradoPorId ? parseInt(registradoPorId) : null,
      },
    });

    res.status(201).json(vital);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar signos vitales' });
  }
});

// PRODUCTS / INVENTORY ENDPOINTS
app.get('/api/residents/:id/products', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const products = await prisma.product.findMany({
      where: { residentId },
      orderBy: { nombre: 'asc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/api/residents/:id/products', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const { nombre, categoria, cantidad, stockMinimo, unidadMedida, fechaVencimiento } = req.body;

    const product = await prisma.product.create({
      data: {
        residentId,
        nombre,
        categoria: categoria || 'General',
        cantidad: parseInt(cantidad) || 0,
        stockMinimo: parseInt(stockMinimo) || 5,
        unidadMedida: unidadMedida || 'unidades',
        fechaVencimiento,
      },
    });

    // Check if stock is low to generate alert
    if (product.cantidad <= product.stockMinimo) {
      await prisma.alert.create({
        data: {
          residentId,
          productId: product.id,
          tipo: 'REABASTECIMIENTO',
          mensaje: `El producto ${product.nombre} requiere reabastecimiento (Quedan ${product.cantidad} ${product.unidadMedida})`,
        },
      });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.patch('/api/residents/:id/products/:productId/quantity', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const { delta } = req.body;

    const current = await prisma.product.findUnique({ where: { id: productId } });
    if (!current) return res.status(404).json({ error: 'Producto no encontrado' });

    const newQuantity = Math.max(0, current.cantidad + parseInt(delta));
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { cantidad: newQuantity },
    });

    // If stock dropped below stockMinimo, check alert
    if (updated.cantidad <= updated.stockMinimo) {
      await prisma.alert.create({
        data: {
          residentId: updated.residentId,
          productId: updated.id,
          tipo: 'REABASTECIMIENTO',
          mensaje: `Alerta: Stock bajo de ${updated.nombre} (${updated.cantidad} ${updated.unidadMedida})`,
        },
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cantidad de producto' });
  }
});

// RECIPES ENDPOINTS
app.get('/api/residents/:id/recipes', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const recipes = await prisma.recipe.findMany({
      where: { residentId },
      include: { detalles: true },
      orderBy: { fecha: 'desc' },
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

app.post('/api/residents/:id/recipes', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const { diagnostico, medico, detalles } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        residentId,
        diagnostico,
        medico,
        detalles: {
          create: detalles.map((d: any) => ({
            medicamento: d.medicamento,
            dosis: d.dosis,
            frecuencia: d.frecuencia,
            duracion: d.duracion,
          })),
        },
      },
      include: { detalles: true },
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar receta' });
  }
});

app.patch('/api/residents/:id/recipes/:recipeId/status', async (req, res) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const { estado } = req.body;

    const updated = await prisma.recipe.update({
      where: { id: recipeId },
      data: { estado },
      include: { detalles: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado de receta' });
  }
});

// REPLENISHMENT & ALERTS ENDPOINTS
app.get('/api/residents/:id/alerts', async (req, res) => {
  try {
    const residentId = parseInt(req.params.id);
    const alerts = await prisma.alert.findMany({
      where: { residentId },
      include: { product: true },
      orderBy: { fecha: 'desc' },
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

app.patch('/api/residents/:id/alerts/:alertId/attend', async (req, res) => {
  try {
    const alertId = parseInt(req.params.alertId);
    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: { atendida: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar alerta atendida' });
  }
});

app.patch('/api/residents/:id/alerts/:alertId/acknowledge', async (req, res) => {
  try {
    const alertId = parseInt(req.params.alertId);
    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: { enteradoFamiliar: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar enterado familiar' });
  }
});

app.listen(PORT, () => {
  console.log(`[Backend Raíz Digital] Servidor corriendo en http://localhost:${PORT}`);
});
