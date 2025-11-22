import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  // In production (Cloud Run), allow all origins for demo simplicity
  // In production apps, specify exact frontend URLs
  const corsOrigin = process.env.NODE_ENV === 'production' 
    ? true // Allow all origins for demo
    : (process.env.FRONTEND_URL || 'http://localhost:3000');
  
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const port = process.env.PORT || process.env.BACKEND_PORT || 3001;
  await app.listen(port, '0.0.0.0'); // Cloud Run requires 0.0.0.0
  
  console.log(`🚀 Backend API running on port: ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'devfest_db'}`);
}
bootstrap();

