require('dotenv').config();
const fs = require('fs');
const nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

const subscriptions = [];
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const initializeSubscriptions = () => {
  fs.readFile(__dirname + "/../../data/subscriptions.json", 'utf-8', (err, jsonString) => {
    if (err) {
      console.log("Error reading subscriptions from the disk. Please reload", err);
      return;
    }
    try {
      subscriptions.push(...JSON.parse(jsonString));
    } catch (err) {
      console.log("Error parsing JSON string for subscriptions:", err);
      console.log("Please reload!");
    }
  });
}

const saveSubscriptions = () => {
  const jsonContent = JSON.stringify(subscriptions)
  fs.writeFileSync(__dirname + "/../../data/subscriptions.json", jsonContent, 'utf8', (err) => {
    if (err) {
      console.log("An error occured while saving the subscriptions.");
      return console.log(err);
    }
  });

  console.log("The subscriptions data was saved successfully.");
}

// send each subscription a different email
const sendNewsLetter = async () => {
  subscriptions.forEach(async (s) => {
    const output = `
      <h3>Hi ${s.name}</h3>
      Welcome to our newsletter!
    `
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_LOGIN, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.USER, // sender address
      to: s.email, // receiver
      subject: "Newsletter Clothing Store", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
}

const sendNewsLetter2 = async () => {
  const output = `
    Welcome to our newsletter!
  `

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_LOGIN, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // get a string with all emails separated by a comma and a space after
  sendTo = subscriptions.map(s => s.email).join(", ");

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.USER, // sender address
    to: sendTo, // list of receivers
    subject: "Newsletter Clothing Store", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const validateSubscriptionData = (name, email) => {
  if (name === "" || email === "") {
    return false
  }

  return emailRegex.test(email);
}

module.exports = {
  subscriptions,
  initializeSubscriptions,
  saveSubscriptions,
  sendNewsLetter,
  validateSubscriptionData,
}