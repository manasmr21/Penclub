import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ReadlistService } from "./readlist.service";
import { CreateReadlistDto } from "./dto/create-readlist.dto";
import { UpdateReadlistDto } from "./dto/update-readlist.dto";

@Controller("readlists")
export class ReadlistController {
    constructor(private readlistService: ReadlistService) { }

    // Create a new readlist
    @Post()
    @UseGuards(AuthGuard("jwt"))
    async create(@Body() dto: CreateReadlistDto, @Request() req: any) {
        return this.readlistService.createReadlist(dto, req.user.id);
    }

    // Get all readlists belonging to the logged-in user
    @Get("my")
    @UseGuards(AuthGuard("jwt"))
    async getMyReadlists(@Request() req: any) {
        return this.readlistService.getMyReadlists(req.user.id);
    }

    // Get all public readlists of any user
    @Get("user/:userId")
    async getUserReadlists(@Param("userId") userId: string) {
        return this.readlistService.getUserReadlists(userId);
    }

    // Get a single readlist by ID (owner sees their own, public = accessible to anyone)
    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async getReadlistById(@Param("id") id: string, @Request() req: any) {
        return this.readlistService.getReadlistById(id, req.user.id);
    }

    // Toggle a book in a readlist (adds if absent, removes if present)
    @Post(":id/toggle/:bookId")
    @UseGuards(AuthGuard("jwt"))
    async toggleBook(
        @Param("id") id: string,
        @Param("bookId") bookId: string,
        @Request() req: any
    ) {
        return this.readlistService.toggleBook(id, bookId, req.user.id);
    }

    // Update readlist name or visibility
    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateReadlistDto,
        @Request() req: any
    ) {
        return this.readlistService.updateReadlist(id, dto, req.user.id);
    }

    // Delete a readlist
    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: string, @Request() req: any) {
        return this.readlistService.deleteReadlist(id, req.user.id);
    }
}
