import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";

const user = process.env.mail
const pass = process.env.password

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user : user,
            pass : pass
        }
    });

    async sendMailService(to: string, subject: string, message: string){
        return await this.transporter.sendMail({
            from: user,
            to,
            subject,
            html:`
                <p>${message}</p>
            `
        })
    }
}
