import axios from 'axios'
import type { GatewayInterface, GatewayTransaction, GatewayResponse } from './gateway_interface.js'

export default class GatewayTwo implements GatewayInterface {
  private baseUrl = 'http://localhost:3002'
  private headers = {
    'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
    'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
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
      { headers: this.headers }
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
      { headers: this.headers }
    )
  }
}