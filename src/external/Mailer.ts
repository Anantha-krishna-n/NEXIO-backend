import { IMailer } from "../interfaces/repositories/IMailer";
import nodemailer from "nodemailer"
import { generateEmailTemplate } from "../presentation/utils/emailTemplate";

export class Mailer implements IMailer {
    async SendEmail(to: string, otp: string) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "nexiocollab3533@gmail.com",
          pass: process.env.SMTP_KEY,
        }, 
      })
      const htmlContent = generateEmailTemplate(otp);
      async function main() {
        let res = await transporter.sendMail({
          from: "NEXIO<nexiocollab3533@gmail.com>",
          to: `${to}`,
          subject: "Email for verification",
          html: htmlContent,
        })
        console.log(`Email sent to ${to}`);
      }
      main().catch(console.error)
      return true
    }
  }