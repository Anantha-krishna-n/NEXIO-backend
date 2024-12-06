export default function emailTemplate(fullname: string, email: string, token: string): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Hello ${fullname},</h2>
        <p>Thank you for signing up for our platform. Please verify your email address by clicking the link below:</p>
        <a 
          href="${process.env.CLIENT_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}"
          style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        <p>If you did not request this email, you can safely ignore it.</p>
        <p>Thanks, <br /> The Team</p>
      </div>
    `;
  }
  