import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private templatesDir: string;

  constructor(private readonly configService: ConfigService) {
    this.templatesDir = path.join(process.cwd(), 'src/notifications/templates/email');
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');
    const secure = this.configService.get<boolean>('MAIL_SECURE', false);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    // Verify connection
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(`Mail service connection error: ${error.message}`);
      } else {
        this.logger.log('Mail service ready to send emails');
      }
    });
  }

  private async compileTemplate(templateName: string, context: any): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      this.logger.error(`Error compiling email template: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const from = this.configService.get<string>('MAIL_FROM');

      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const subject = 'Welcome to Taly CRM';
      const html = await this.compileTemplate('welcome', {
        firstName,
        appUrl: this.configService.get<string>('FRONTEND_URL'),
      });
      
      await this.sendEmail(email, subject, html);
    } catch (error) {
      this.logger.error(`Error sending welcome email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetUrl: string): Promise<void> {
    try {
      const subject = 'Reset Your Password';
      const html = await this.compileTemplate('password-reset', {
        firstName,
        resetUrl,
        expiryTime: '1 hour',
      });
      
      await this.sendEmail(email, subject, html);
    } catch (error) {
      this.logger.error(`Error sending password reset email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendAppointmentConfirmation(email: string, firstName: string, appointment: any): Promise<void> {
    try {
      const subject = 'Appointment Confirmation';
      const html = await this.compileTemplate('appointment-confirmation', {
        firstName,
        appointment,
      });
      
      await this.sendEmail(email, subject, html);
    } catch (error) {
      this.logger.error(`Error sending appointment confirmation: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendAppointmentReminder(email: string, firstName: string, appointment: any): Promise<void> {
    try {
      const subject = 'Appointment Reminder';
      const html = await this.compileTemplate('appointment-reminder', {
        firstName,
        appointment,
      });
      
      await this.sendEmail(email, subject, html);
    } catch (error) {
      this.logger.error(`Error sending appointment reminder: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendPaymentReceipt(email: string, firstName: string, payment: any): Promise<void> {
    try {
      const subject = 'Payment Receipt';
      const html = await this.compileTemplate('payment-receipt', {
        firstName,
        payment,
      });
      
      await this.sendEmail(email, subject, html);
    } catch (error) {
      this.logger.error(`Error sending payment receipt: ${error.message}`, error.stack);
      throw error;
    }
  }
}