import { Module } from "@nestjs/common";
import { MailService } from "./sendMails";

@Module({
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
