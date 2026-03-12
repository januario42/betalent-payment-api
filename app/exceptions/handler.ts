import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    // Erro de rota não encontrada
    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return ctx.response.notFound({ message: 'Rota não encontrada' })
    }

    // Erro de autenticação
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.unauthorized({ message: 'Não autorizado' })
    }

    // Erro de recurso não encontrado
    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.notFound({ message: 'Recurso não encontrado' })
    }

    // Erro de validação
    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response.unprocessableEntity({ errors: error.messages })
    }

    // Erros gerais de aplicação (ex: todos os gateways falharam)
    if (error instanceof Error) {
      return ctx.response.internalServerError({ message: error.message })
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}