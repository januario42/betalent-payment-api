import axios from 'axios'
import env from '#start/env'
import type { GatewayInterface, GatewayTransaction, GatewayResponse } from './gateway_interface.js'

export default class GatewayOne implements GatewayInterface {
  private baseUrl = env.get('GATEWAY1_URL')
  private token: string | null = null

  private async authenticate(): Promise<void> {
    const response = await axios.post(`${this.baseUrl}/login`, {
      email: env.get('GATEWAY1_EMAIL'),
      token: env.get('GATEWAY1_TOKEN'),
    })
    this.token = response.data.token
  }

  private getHeaders() {
    return { Authorization: `Bearer ${this.token}` }
  }

  async charge(data: GatewayTransaction): Promise<GatewayResponse> {
    await this.authenticate()

    const response = await axios.post(
      `${this.baseUrl}/transactions`,
      {
        amount: data.amount,
        name: data.name,
        email: data.email,
        cardNumber: data.cardNumber,
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
    await this.authenticate()
    await axios.post(
      `${this.baseUrl}/transactions/${externalId}/charge_back`,
      {},
      { headers: this.getHeaders() }
    )
  }
}