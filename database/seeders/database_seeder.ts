import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Gateway from '#models/gateway'

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    // Usuário admin
    await User.updateOrCreate(
      { email: 'admin@betalent.com' },
      {
        fullName: 'Admin',
        email: 'admin@betalent.com',
        password: 'admin123',
        role: 'admin',
      }
    )

    // Gateways
    await Gateway.updateOrCreate(
      { name: 'Gateway 1' },
      {
        name: 'Gateway 1',
        isActive: true,
        priority: 1,
      }
    )

    await Gateway.updateOrCreate(
      { name: 'Gateway 2' },
      {
        name: 'Gateway 2',
        isActive: true,
        priority: 2,
      }
    )

    console.log('✅ Seeder executado com sucesso!')
  }
}