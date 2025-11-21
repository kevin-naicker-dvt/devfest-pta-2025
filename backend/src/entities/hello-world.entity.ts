import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hello_world')
export class HelloWorld {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

