import { IMailer } from "../interfaces/repositories/IMailer";
import nodemailer from "nodemailer"

export class Mailer implements IMailer {
    async SendEmail(to: string, data: any) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "nexiocollab3533@gmail.com",
          pass: process.env.SMTP_KEY,
        }, 
      })
      async function main() {
        let res = await transporter.sendMail({
          from: "NEXIO<nexiocollab3533@gmail.com>",
          to: `${to}`,
          subject: "Email for verification",
          html: data,
        })
        console.log("Message sent:", res);
      }
      main().catch(console.error)
      return true
    }
  }