import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Product from '#models/product'
import PaymentService from '#services/payment_service'
import { createTransactionValidator } from '#validators/transaction'

export default class TransactionsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (query) => {
        query.preload('product')
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok(transactions)
  }

  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (query) => {
        query.preload('product')
      })
      .firstOrFail()
    return response.ok(transaction)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createTransactionValidator)

    const client = await Client.firstOrCreate(
      { email: data.email },
      { name: data.name, email: data.email }
    )

    const ids = data.products.map((item) => item.id)
    const products = await Product.query().whereIn('id', ids).whereNull('deleted_at')

    if (products.length !== ids.length) {
      return response.badRequest({ message: 'Um ou mais produtos não encontrados' })
    }

    let totalAmount = 0
    for (const item of data.products) {
      const product = products.find((p) => p.id === item.id)
      if (product) {
        totalAmount += product.amount * item.quantity
      }
    }

    const paymentService = new PaymentService()
    const { gateway, result } = await paymentService.charge({
      amount: totalAmount,
      name: data.name,
      email: data.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: gateway.id,
      externalId: result.externalId,
      status: result.status,
      amount: totalAmount,
      cardLastNumbers: result.cardLastNumbers,
    })

    for (const item of data.products) {
      await TransactionProduct.create({
        transactionId: transaction.id,
        productId: item.id,
        quantity: item.quantity,
      })
    }

    await transaction.load('transactionProducts', (query) => query.preload('product'))
    await transaction.load('gateway')
    await transaction.load('client')

    return response.created(transaction)
  }

  async refund({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('gateway')
      .firstOrFail()

    if (transaction.status === 'refunded') {
      return response.badRequest({ message: 'Transação já foi reembolsada' })
    }

    if (!transaction.externalId) {
      return response.badRequest({ message: 'Transação sem ID externo' })
    }

    const paymentService = new PaymentService()
    await paymentService.refund(transaction.gateway.name, transaction.externalId)

    transaction.status = 'refunded'
    await transaction.save()

    return response.ok({ message: 'Reembolso realizado com sucesso', transaction })
  }
}