import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloWorld } from './entities/hello-world.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(HelloWorld)
    private helloWorldRepository: Repository<HelloWorld>,
  ) {}

  async onModuleInit() {
    // Seed initial data if table is empty
    const count = await this.helloWorldRepository.count();
    if (count === 0) {
      await this.helloWorldRepository.save({
        message: 'Hello World from DevFest PTA 2025! 🚀',
      });
      console.log('✅ Database seeded with initial hello_world message');
    }
  }

  async getHelloWorld() {
    const result = await this.helloWorldRepository.findOne({
      where: { id: 1 },
    });
    
    return {
      message: result?.message || 'Hello World from DevFest PTA 2025!',
      source: 'database',
      timestamp: new Date().toISOString(),
    };
  }
}

