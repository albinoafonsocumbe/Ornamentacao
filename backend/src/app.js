const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const servicoRoutes = require("./routes/servicoRoutes");
const eventoRoutes = require("./routes/eventoRoutes");
const pacoteRoutes = require("./routes/pacoteRoutes");
const portefolioRoutes = require("./routes/portefolioRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const tarifaRoutes = require("./routes/tarifaRoutes");

const app = express();

// ── Segurança: cabeçalhos HTTP ───────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // permite servir imagens
  }),
);

// ── CORS ─────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

// ── Body parser ──────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ── Rate limiting global ─────────────────────────
const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    sucesso: false,
    mensagem: "Demasiadas tentativas. Tente mais tarde.",
  },
});

// Rate limiter mais apertado para o login
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    sucesso: false,
    mensagem: "Demasiadas tentativas de login. Tente em 15 minutos.",
  },
});

// Rate limiter para criação de pedidos (anti-spam)
const limitadorPedidos = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: {
    sucesso: false,
    mensagem: "Limite de pedidos atingido. Tente novamente mais tarde.",
  },
});

app.use(limitadorGeral);

// ── Servir imagens ───────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── Rota de saúde ────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ mensagem: "API Ornamentação — Online", versao: "2.0" });
});

// ── Rotas ─────────────────────────────────────────
app.use("/api/auth", limitadorLogin, authRoutes);
app.use("/api/servicos", servicoRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/pacotes", pacoteRoutes);
app.use("/api/portefolio", portefolioRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/tarifas", tarifaRoutes);

// ── Handler de erros global ──────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Erro]", err.stack || err.message);

  // Erros do Multer (upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .json({
        sucesso: false,
        mensagem: "Ficheiro demasiado grande. Máximo 5MB.",
      });
  }
  if (err.message?.includes("imagens")) {
    return res.status(400).json({ sucesso: false, mensagem: err.message });
  }

  res
    .status(500)
    .json({ sucesso: false, mensagem: "Erro interno do servidor." });
});

// ── Servir frontend em produção ──────────────────
if (process.env.NODE_ENV === "production") {
  const frontendBuild = path.join(__dirname, "../../frontend/build");
  app.use(
    express.static(frontendBuild, {
      maxAge: "7d", // cache de 7 dias para assets estáticos
      etag: true,
    }),
  );
  // Todas as outras rotas devolvem o index.html (SPA)
  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
}

// ── Rota não encontrada ──────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({
      sucesso: false,
      mensagem: `Rota ${req.method} ${req.path} não encontrada.`,
    });
});

module.exports = app;
