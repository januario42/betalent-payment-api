export interface GatewayTransaction {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface GatewayResponse {
  externalId: string
  status: 'approved' | 'pending'
  cardLastNumbers: string
}

export interface GatewayInterface {
  charge(data: GatewayTransaction): Promise<GatewayResponse>
  refund(externalId: string): Promise<void>
}