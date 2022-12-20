import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from 'src/create-user/create-user.dto';

@Processor('sendMail-queue')
export class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'NestJS <llemosv@git.com>',
      subject: 'Bem Vindo(a)!',
      text: `Olá, ${data.name}, cadastro realizado com sucesso!`,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log('FILA COMPLETA', job.name);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log('FILA ATIVA', job.name);
  }
}
