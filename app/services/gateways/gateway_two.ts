import axios from 'axios'
import env from '#start/env'
import type { GatewayInterface, GatewayTransaction, GatewayResponse } from './gateway_interface.js'

export default class GatewayTwo implements GatewayInterface {
  private baseUrl = env.get('GATEWAY2_URL')

  private getHeaders() {
    return {
      'Gateway-Auth-Token': env.get('GATEWAY2_AUTH_TOKEN'),
      'Gateway-Auth-Secret': env.get('GATEWAY2_AUTH_SECRET'),
    }
  }

  async charge(data: GatewayTransaction): Promise<GatewayResponse> {
    const response = await axios.post(
      `${this.baseUrl}/transacoes`,
      {
        valor: data.amount,
        nome: data.name,
        email: data.email,
        numeroCartao: data.cardNumber,
        cvv: data.cvv,
      },
      { headers: this.getHeaders() }
    )

    const result = response.data
    return {
      externalId: result.id,
      status: 'approved' as const,
      cardLastNumbers: data.cardNumber.slice(-4),
    }
  }

  async refund(externalId: string): Promise<void> {
    await axios.post(
      `${this.baseUrl}/transacoes/reembolso`,
      { id: externalId },
      { headers: this.getHeaders() }
    )
  }
}