import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'

export default class ClientsController {
  async index({ request, response }: HttpContext) {
  const page = request.input('page', 1)
  const limit = request.input('limit', 10)

  const clients = await Client.query().paginate(page, limit)
  return response.ok(clients)
}

  async show({ params, response }: HttpContext) {
    const client = await Client.query()
      .where('id', params.id)
      .preload('transactions', (query) => {
        query.preload('transactionProducts', (tpQuery) => {
          tpQuery.preload('product')
        })
        query.preload('gateway')
      })
      .firstOrFail()

    return response.ok(client)
  }
}