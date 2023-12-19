import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, text) => {
    const transport = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: true, 
        // secureConnection: false,
        // tls: {
        //    ciphers: "SSLv3",
        // },
        // requireTLS: true,
        // debug: true,
        // connectionTimeout: 10000,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transport.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject,
        text,
    });
};