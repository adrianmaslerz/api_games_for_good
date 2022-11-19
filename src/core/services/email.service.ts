import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironments } from 'src/config/environments';
import * as sendgrid from '@sendgrid/mail';

interface ISendOptions {
  email: string;
  template: string;
  subject: string;
  args: any;
}

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService<IEnvironments>) {
    sendgrid.setApiKey(this.configService.get('SENDGRID_KEY'));
  }

  private send(data: ISendOptions): Promise<any> {
    return sendgrid
      .send({
        from: this.configService.get('SENDGRID_SENDER_EMAIL'),
        to: data.email,
        templateId: data.template,
        subject: data.subject,
        personalizations: [
          {
            subject: data.subject,
            to: [{ email: data.email }],
            dynamicTemplateData: {
              ...data.args,
            },
          },
        ],
      })
      .catch((err: any) => console.log(err.response?.body));
  }

  public resetPassword(
    email: string,
    args: { 'reset-link': string },
  ): Promise<any> {
    return this.send({
      email,
      template: 'd-c097cd2462e74ede82bbdefc9a97d818',
      subject: 'Password reset',
      args,
    });
  }

  public welomeUser(email: string, args: { password: string }): Promise<any> {
    return this.send({
      email,
      template: 'd-c5f46a4817b740bcacbf40fb1772dda6',
      subject: 'Welcome to games for good',
      args,
    });
  }
}
