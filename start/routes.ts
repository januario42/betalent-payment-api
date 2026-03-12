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

  // Usuários — só admin
  router.resource('users', UsersController).apiOnly()
    .use('*', middleware.role({ roles: ['admin'] }))

  // Produtos — qualquer autenticado
  router.resource('products', ProductsController).apiOnly()

  // Clientes — só admin
  router.get('/clients', [ClientsController, 'index'])
    .use(middleware.role({ roles: ['admin'] }))
  router.get('/clients/:id', [ClientsController, 'show'])
    .use(middleware.role({ roles: ['admin'] }))

  // Transações — qualquer autenticado
  router.get('/transactions', [TransactionsController, 'index'])
  router.get('/transactions/:id', [TransactionsController, 'show'])

  // Reembolso — só admin
  router.post('/transactions/:id/refund', [TransactionsController, 'refund'])
    .use(middleware.role({ roles: ['admin'] }))

  // Gateways — só admin
  router.patch('/gateways/:id/toggle', [GatewaysController, 'toggleActive'])
    .use(middleware.role({ roles: ['admin'] }))
  router.patch('/gateways/:id/priority', [GatewaysController, 'updatePriority'])
    .use(middleware.role({ roles: ['admin'] }))

}).use(middleware.auth())