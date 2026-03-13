import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

interface AppError {
  code?: string
  message?: string
  messages?: unknown
}

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: AppError, ctx: HttpContext) {
    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return ctx.response.notFound({ message: 'Rota não encontrada' })
    }

    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.unauthorized({ message: 'Não autorizado' })
    }

    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.notFound({ message: 'Recurso não encontrado' })
    }

    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response.unprocessableEntity({ errors: error.messages })
    }

    if (error instanceof Error) {
      return ctx.response.internalServerError({ message: error.message })
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}