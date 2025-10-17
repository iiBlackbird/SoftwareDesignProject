import * as nodemailer from 'nodemailer';

// This file is for development purposes only.
// It creates a test account on Ethereal and logs the credentials.
// These credentials can then be used to configure the MailerModule.

const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal test account created:');
  console.log('User:', testAccount.user);
  console.log('Password:', testAccount.pass);
  console.log('SMTP Host:', testAccount.smtp.host);
  console.log('SMTP Port:', testAccount.smtp.port);
  console.log('SMTP Secure:', testAccount.smtp.secure);
};

createTestAccount();
