import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloWorld } from './entities/hello-world.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(HelloWorld)
    private helloWorldRepository: Repository<HelloWorld>,
  ) {}

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

