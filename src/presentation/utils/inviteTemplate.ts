export const inviteTemplate = (inviteLink: string): string => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 10px 0;
        background: #007bff;
        color: white;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        margin: 20px 0;
        color: #333;
      }
      .cta-button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .cta-button:hover {
        background: #0056b3;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Classroom Invitation</div>
      <div class="content">
        <p>Hello,</p>
        <p>
          You have been invited to join a classroom. Click the button below to join:
        </p>
        <a href="${inviteLink}" class="cta-button">Join Classroom</a>
        <p>If the button doesn't work, copy and paste the following link into your browser:</p>
        <p>${inviteLink}</p>
        <p>We look forward to seeing you in the classroom!</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Classroom App. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
