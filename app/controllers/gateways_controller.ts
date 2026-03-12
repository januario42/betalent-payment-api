import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import { updatePriorityValidator } from '#validators/gateway'

export default class GatewaysController {
  async toggleActive({ params, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    gateway.isActive = !gateway.isActive
    await gateway.save()
    return response.ok(gateway)
  }

  async updatePriority({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    const { priority } = await request.validateUsing(updatePriorityValidator)
    gateway.priority = priority
    await gateway.save()
    return response.ok(gateway)
  }
}