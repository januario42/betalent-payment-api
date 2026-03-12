# BeTalent Payment API

API RESTful de gerenciamento de pagamentos multi-gateway desenvolvida com AdonisJS v6 e MySQL.

## 🚀 Tecnologias

- [AdonisJS v6](https://adonisjs.com/)
- [MySQL 8.0](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [VineJS](https://vinejs.dev/)

## 📋 Requisitos

- [Node.js](https://nodejs.org/) >= 20
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## ⚙️ Instalação
```bash
# Clone o repositório
git clone https://github.com/januario42/betalent-payment-api.git
cd betalent-payment-api

# Instale as dependências
npm install

# Configure o .env
cp .env.example .env

# Gere a APP_KEY
node ace generate:key
# Cole a chave gerada no .env na variável APP_KEY
```

## 🐳 Subindo o ambiente
```bash
# Sobe MySQL + mock dos gateways
docker-compose up -d

# Aguarde o MySQL inicializar completamente (pode levar 1-2 minutos na primeira vez)
# Verifique se está pronto com:
docker logs betalent_mysql --tail 3
# Quando aparecer "ready for connections" pode prosseguir

# Roda as migrations e popula o banco
node ace migration:fresh --seed

# Inicia o servidor
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

## 👤 Usuário padrão

| Campo | Valor              |
|-------|--------------------|
| Email | admin@betalent.com |
| Senha | admin123           |
| Role  | admin              |

## 🔌 Gateways

Os mocks dos gateways sobem automaticamente via Docker:

| Gateway   | URL                   |
|-----------|-----------------------|
| Gateway 1 | http://localhost:3001 |
| Gateway 2 | http://localhost:3002 |

A collection do Postman está disponível em `docs/gateways-collection.json`.

## 🛣️ Rotas

### Públicas

| Método | Rota          | Descrição               |
|--------|---------------|-------------------------|
| POST   | /login        | Autenticação do usuário |
| POST   | /transactions | Realizar uma compra     |

### Privadas (requer Bearer Token)

#### Usuários (só admin)

| Método | Rota        | Descrição        |
|--------|-------------|------------------|
| GET    | /users      | Listar usuários  |
| POST   | /users      | Criar usuário    |
| GET    | /users/:id  | Detalhar usuário |
| PUT    | /users/:id  | Atualizar usuário|
| DELETE | /users/:id  | Deletar usuário  |

#### Produtos (autenticado)

| Método | Rota           | Descrição        |
|--------|----------------|------------------|
| GET    | /products      | Listar produtos  |
| POST   | /products      | Criar produto    |
| GET    | /products/:id  | Detalhar produto |
| PUT    | /products/:id  | Atualizar produto|
| DELETE | /products/:id  | Deletar produto  |

#### Clientes (só admin)

| Método | Rota         | Descrição                       |
|--------|--------------|---------------------------------|
| GET    | /clients     | Listar clientes                 |
| GET    | /clients/:id | Detalhar cliente e suas compras |

#### Transações (autenticado)

| Método | Rota                     | Descrição                    |
|--------|--------------------------|------------------------------|
| GET    | /transactions            | Listar transações            |
| GET    | /transactions/:id        | Detalhar transação           |
| POST   | /transactions/:id/refund | Reembolsar transação (admin) |

#### Gateways (só admin)

| Método | Rota                     | Descrição                |
|--------|--------------------------|--------------------------|
| PATCH  | /gateways/:id/toggle     | Ativar/desativar gateway |
| PATCH  | /gateways/:id/priority   | Alterar prioridade       |

## 📦 Exemplo de compra
```json
POST /transactions
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cardNumber": "5569000000006063",
  "cvv": "010",
  "products": [
    { "id": 1, "quantity": 2 }
  ]
}
```

## 🔄 Lógica de fallback

Ao realizar uma compra, o sistema tenta processar pelo gateway de maior prioridade (menor número). Se falhar, tenta o próximo gateway ativo automaticamente. O cliente nunca recebe um erro se ao menos um gateway funcionar.

## ⚠️ Pendências

- TDD não foi implementado devido ao prazo reduzido. Seria o próximo passo utilizando o Japa (test runner nativo do AdonisJS).
- Roles de produtos poderiam ser mais granulares (ex: separar quem pode criar vs apenas visualizar).