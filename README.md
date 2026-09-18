# ✦ Ornamentação — Plataforma de Decoração de Eventos

Plataforma web completa para empresa de decoração de eventos em Moçambique.  
Backend Node.js/Express + PostgreSQL · Frontend React · Painel administrativo com JWT.

---

## 📋 Requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 14+ |

---

## 🚀 Instalação local

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd Ornamentacao
```

### 2. Configurar o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar o ficheiro `.env` com os teus valores:

```env
DB_PASSWORD=a_tua_password_postgres
JWT_SECRET=string_aleatoria_longa
EMAIL_USER=teu_email@gmail.com
EMAIL_PASS=app_password_gmail
WHATSAPP_NUMBER=258841234567
```

### 3. Criar a base de dados

```bash
# No PostgreSQL, criar a base de dados:
psql -U postgres -c "CREATE DATABASE \"plataforma-ornamentacao\";"

# Executar o script de setup:
psql -U postgres -d plataforma-ornamentacao -f src/config/setup.sql
```

### 4. Criar o admin inicial

```bash
node criar-admin.js
```

Credenciais padrão criadas:
- **Email:** `admin@ornamentacao.mz`
- **Password:** `Admin@2024`

> ⚠️ Alterar a password após o primeiro login.

### 5. Iniciar o Backend

```bash
npm run dev        # desenvolvimento (nodemon)
npm start          # produção
```

O backend fica disponível em `http://localhost:3000`

---

### 6. Configurar o Frontend

```bash
cd ../frontend
npm install
```

O ficheiro `.env` já está configurado para desenvolvimento local:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:3000/api
```

### 7. Iniciar o Frontend

```bash
npm start
```

O frontend fica disponível em `http://localhost:3001`

---

## 🗂️ Estrutura do Projecto

```
Ornamentacao/
├── backend/
│   ├── src/
│   │   ├── config/          # BD, upload, setup.sql
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middleware/       # Auth JWT
│   │   ├── models/          # Queries PostgreSQL
│   │   ├── routes/          # Rotas Express
│   │   └── services/        # Email (Nodemailer)
│   ├── uploads/             # Imagens do portefólio
│   ├── .env.example
│   ├── criar-admin.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── admin/           # Painel administrativo
        │   ├── components/  # AdminLayout, RotaProtegida
        │   ├── context/     # AuthContext (JWT)
        │   └── pages/       # Dashboard, CRUD pages
        ├── components/      # Navbar, Footer, WhatsAppBtn
        ├── pages/           # Páginas públicas
        └── services/        # axios api.js
```

---

## 🔑 Rotas da API

### Públicas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/servicos` | Listar serviços activos |
| GET | `/api/eventos` | Listar eventos activos |
| GET | `/api/pacotes` | Listar pacotes activos |
| GET | `/api/portefolio` | Listar portefólio activo |
| GET | `/api/portefolio/categorias` | Listar categorias |
| POST | `/api/pedidos` | Submeter pedido de orçamento |
| GET | `/api/tarifas` | Listar tarifas activas |
| POST | `/api/tarifas/calcular` | Calcular estimativa |

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login admin |
| GET | `/api/auth/perfil` | Perfil do admin logado |

### Admin (requer Bearer token)
| Método | Rota | Descrição |
|---|---|---|
| GET/POST | `/api/servicos/admin/todos` | CRUD serviços |
| GET/POST | `/api/pacotes/admin/todos` | CRUD pacotes |
| GET/POST | `/api/portefolio/admin/todos` | CRUD portefólio |
| GET/PATCH/DELETE | `/api/pedidos/:id` | Gerir pedidos |
| GET/POST | `/api/tarifas/admin/todos` | CRUD tarifas |

---

## 🌐 Painel Administrativo

Aceder em: `http://localhost:3001/admin/login`

| Funcionalidade | URL |
|---|---|
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Pedidos | `/admin/pedidos` |
| Serviços | `/admin/servicos` |
| Pacotes | `/admin/pacotes` |
| Portefólio | `/admin/portefolio` |
| Tarifas | `/admin/tarifas` |

---

## 📧 Configurar Email (Gmail)

1. Ir a [myaccount.google.com](https://myaccount.google.com)
2. Segurança → Verificação em dois passos (activar)
3. Segurança → Passwords de aplicação
4. Criar password para "Outra aplicação" → copiar para `EMAIL_PASS` no `.env`

---

## 🚢 Deploy em Produção

### Backend (ex: Railway, Render, VPS)

```bash
# Variáveis de ambiente a configurar no servidor:
NODE_ENV=production
PORT=3000
DB_HOST=...
DB_PASSWORD=...
JWT_SECRET=...      # string aleatória longa e segura
EMAIL_USER=...
EMAIL_PASS=...
FRONTEND_URL=https://o-teu-dominio.com
ADMIN_URL=https://o-teu-dominio.com
```

### Frontend (ex: Vercel, Netlify)

```bash
cd frontend
npm run build       # gera pasta /build
```

Variável de ambiente no painel da plataforma:
```
REACT_APP_API_URL=https://api.o-teu-dominio.com/api
```

### Servir o Frontend a partir do Backend (opcional)

No `backend/src/app.js`, adicionar após as rotas:

```js
const path = require('path');
// Servir o build do React
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});
```

---

## 🛡️ Segurança implementada

- **Helmet** — cabeçalhos HTTP seguros
- **CORS** — origens permitidas configuráveis
- **Rate limiting** — 200 req/15min geral, 10 logins/15min, 5 pedidos/hora
- **express-validator** — validação de inputs
- **bcryptjs** — hash de passwords (10 rounds)
- **JWT** — tokens com expiração de 8h
- **Multer** — validação de tipo e tamanho de ficheiros (5MB max)

---

## 📅 Cronograma de Desenvolvimento

| Semana | Etapa | Estado |
|---|---|---|
| 1–3 | Requisitos, modelação e base de dados | ✅ |
| 4 | Backend Node.js/Express + PostgreSQL | ✅ |
| 5 | Área pública (website) | ✅ |
| 6 | Portefólio com galeria | ✅ |
| 7 | Calculadora de estimativa | ✅ |
| 8 | Sistema de pedidos | ✅ |
| 9 | Área administrativa completa | ✅ |
| 10 | Integrações (WhatsApp, Email, Mapas) | ✅ |
| 11 | Testes e segurança | ✅ |
| 12 | Publicação e documentação | ✅ |

---

*Desenvolvido para Ornamentação — Decoração Premium de Eventos, Maputo, Moçambique.*
