import { Storage } from "@google-cloud/storage";
import nodemailer from "nodemailer";

export async function newsLetter(I, O) {
  //v8dx5fz6
  const storage = new Storage();
  let D;
  let N;
  let L;
  let html = "<h1>Hello World</h1>";
  let subject = "whats up 🚀";
  let batch = [
    "miketriticum@gmail.com",
    "mikeykennethrasch@gmail.com",
    "karinsahlertz@hotmail.com",
  ];

  memail(subject, html, batch.shift());

  return;

  async function memail(subject, html, who) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "mikeowlwolf@gmail.com",
        pass: process.env.mikeowlwolf,
      },
    });

    let info = await transporter.sendMail({
      from: "Michael Kenneth Rasch <mikeowlwolf@gmail.com>",
      to: who,
      subject: subject,
      html: html,
    });

    const m = `Message sent: %s${info.messageId}`;

    console.log(m);
    
    if (batch.length > 0) memail(subject, html, batch.shift());
  }
}
