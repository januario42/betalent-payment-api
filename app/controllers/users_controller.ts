import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.query().select('id', 'full_name', 'email', 'role', 'created_at')
    return response.ok(users)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    const user = await User.create(data)
    return response.created({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })
  }

  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = await request.validateUsing(updateUserValidator)
    await user.merge(data).save()
    return response.ok({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.ok({ message: 'Usuário deletado com sucesso' })
  }
}