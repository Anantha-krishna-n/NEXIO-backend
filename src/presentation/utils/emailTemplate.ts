export function generateEmailTemplate(otp: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: #4caf50;
          padding: 20px;
          color: white;
          text-align: center;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #4caf50;
        }
        .footer {
          margin-top: 20px;
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Use the following OTP to verify your email address:</p>
          <p class="otp">${otp}</p>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
        <div class="footer">
          <p>If you didn’t request this email, please ignore it.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
