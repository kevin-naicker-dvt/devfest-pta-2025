import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { HelloWorld } from './entities/hello-world.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'devfest_user',
      password: process.env.DB_PASSWORD || 'DevF3st123-pluto-is-plan3t',
      database: process.env.DB_NAME || 'devfest_db',
      entities: [HelloWorld, Application],
      synchronize: false, // Using migration scripts instead
      logging: true,
    }),
    TypeOrmModule.forFeature([HelloWorld, Application]),
  ],
  controllers: [AppController, ApplicationsController],
  providers: [AppService, ApplicationsService],
})
export class AppModule {}

