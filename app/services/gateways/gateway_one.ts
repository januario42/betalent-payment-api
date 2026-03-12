import axios from 'axios'
import type { GatewayInterface, GatewayTransaction, GatewayResponse } from './gateway_interface.js'

export default class GatewayOne implements GatewayInterface {
  private baseUrl = 'http://localhost:3001'
  private token: string | null = null

  private async authenticate(): Promise<void> {
    const response = await axios.post(`${this.baseUrl}/login`, {
      email: 'dev@betalent.tech',
      token: 'FEC9BB078BF338F464F96B48089EB498',
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