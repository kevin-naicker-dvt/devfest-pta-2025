import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationsRepository.create(createApplicationDto);
    return await this.applicationsRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmail(email: string): Promise<Application[]> {
    return await this.applicationsRepository.find({
      where: { candidateEmail: email },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Application> {
    return await this.applicationsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    await this.applicationsRepository.update(id, updateApplicationDto);
    return this.findOne(id);
  }

  async getStats() {
    const total = await this.applicationsRepository.count();
    const submitted = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.SUBMITTED },
    });
    const underReview = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.UNDER_REVIEW },
    });
    const interview = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.INTERVIEW },
    });
    const accepted = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.ACCEPTED },
    });
    const rejected = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.REJECTED },
    });

    return {
      total,
      byStatus: {
        submitted,
        underReview,
        interview,
        accepted,
        rejected,
      },
    };
  }
}

