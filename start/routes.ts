import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const ClientsController = () => import('#controllers/clients_controller')
const TransactionsController = () => import('#controllers/transactions_controller')
const GatewaysController = () => import('#controllers/gateways_controller')

// ─── Rotas Públicas ───────────────────────────────────────────────
router.post('/login', [AuthController, 'login'])
router.post('/transactions', [TransactionsController, 'store'])

// ─── Rotas Privadas ───────────────────────────────────────────────
router.group(() => {

  // Auth
  router.post('/logout', [AuthController, 'logout'])

  // Usuários
  router.resource('users', UsersController).apiOnly()

  // Produtos
  router.resource('products', ProductsController).apiOnly()

  // Clientes
  router.get('/clients', [ClientsController, 'index'])
  router.get('/clients/:id', [ClientsController, 'show'])

  // Transações
  router.get('/transactions', [TransactionsController, 'index'])
  router.get('/transactions/:id', [TransactionsController, 'show'])
  router.post('/transactions/:id/refund', [TransactionsController, 'refund'])

  // Gateways
  router.patch('/gateways/:id/toggle', [GatewaysController, 'toggleActive'])
  router.patch('/gateways/:id/priority', [GatewaysController, 'updatePriority'])

}).use(middleware.auth())