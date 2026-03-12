import Gateway from '#models/gateway'
import GatewayOne from './gateways/gateway_one.js'
import GatewayTwo from './gateways/gateway_two.js'
import type { GatewayInterface, GatewayTransaction, GatewayResponse } from './gateways/gateway_interface.js'

export default class PaymentService {
  private getGatewayInstance(name: string): GatewayInterface {
    if (name === 'Gateway 1') return new GatewayOne()
    if (name === 'Gateway 2') return new GatewayTwo()
    throw new Error(`Gateway ${name} não implementado`)
  }

  async charge(data: GatewayTransaction): Promise<{ gateway: Gateway; result: GatewayResponse }> {
    const gateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'asc')

    for (const gateway of gateways) {
      try {
        const instance = this.getGatewayInstance(gateway.name)
        const result = await instance.charge(data)
        return { gateway, result }
      } catch (error) {
        console.log(`Gateway ${gateway.name} falhou, tentando próximo...`)
      }
    }

    throw new Error('Todos os gateways falharam')
  }

  async refund(gatewayName: string, externalId: string): Promise<void> {
    const instance = this.getGatewayInstance(gatewayName)
    await instance.refund(externalId)
  }
}