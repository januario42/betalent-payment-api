import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'

export default class ClientsController {
  async index({ response }: HttpContext) {
    const clients = await Client.all()
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