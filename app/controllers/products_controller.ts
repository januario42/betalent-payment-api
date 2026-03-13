import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { DateTime } from 'luxon'

export default class ProductsController {
  async index({ response }: HttpContext) {
    const products = await Product.query().whereNull('deleted_at')
    return response.ok(products)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)
    const product = await Product.create(data)
    return response.created(product)
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    return response.ok(product)
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    const data = await request.validateUsing(updateProductValidator)
    await product.merge(data).save()
    return response.ok(product)
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    product.deletedAt = DateTime.now()
    await product.save()
    return response.ok({ message: 'Produto deletado com sucesso' })
  }
}