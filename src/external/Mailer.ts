import { IMailer } from "../interfaces/repositories/IMailer";
import nodemailer from "nodemailer";
import { generateEmailTemplate } from "../presentation/utils/emailTemplate";
import {inviteTemplate} from "../presentation/utils/inviteTemplate"
export class Mailer implements IMailer {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "nexiocollab3533@gmail.com",
      pass: process.env.SMTP_KEY,
    },
  });

  async SendEmail(to: string, data: { type: "otp" | "invite"; value: string }) {
    let htmlContent: string;

    if (data.type === "otp") {
      htmlContent = generateEmailTemplate(data.value);
    } else if (data.type === "invite") {
      htmlContent = inviteTemplate(data.value);
    } else {
      throw new Error("Invalid email type");
    }

    await this.transporter.sendMail({
      from: "NEXIO<nexiocollab3533@gmail.com>",
      to,
      subject: data.type === "otp" ? "Email for Verification" : "Classroom Invitation",
      html: htmlContent,
    });

    console.log(`Email sent to ${to}`);
    return true;
  }
}
