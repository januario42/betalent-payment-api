import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return response.ok({
      token: token.value!.release(),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user as any
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return response.ok({ message: 'Logout realizado com sucesso' })
    } catch {
      return response.ok({ message: 'Logout realizado com sucesso' })
    }
  }
}