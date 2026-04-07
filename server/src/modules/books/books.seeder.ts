import { DataSource } from "typeorm";
import { Book }  from "./entities/books.entity";
import { User } from "../../modules/users/entities/user.entity";
import { v4 as uuid } from "uuid";

export class BookSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const bookRepo = dataSource.getRepository(Book);
        const userRepo = dataSource.getRepository(User);

        // 👉 Get some users (authors)
        const users = await userRepo.find();

        if (!users.length) {
            console.log("❌ No users found. Seed users first.");
            return;
        }

        const genres = [
            "fiction",
            "fantasy",
            "self-help",
            "romance",
            "tech",
            "history"
        ];

        const books: Partial<Book>[] = [];

        for (let i = 0; i < 50; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomGenre = genres[Math.floor(Math.random() * genres.length)];

            books.push({
                id: uuid(),
                title: `Sample Book ${i + 1}`,
                description: `This is a sample description for book ${i + 1}`,
                genre: randomGenre,
                releaseDate: new Date().toISOString().split("T")[0],
                purchaseLinks: [
                    "https://amazon.com/sample-book",
                    "https://flipkart.com/sample-book"
                ],
                authorId: randomUser.id,
                approved: true,
                state: "approved",
                coverImage: "https://via.placeholder.com/150",
                coverImageId: "sample-image-id"
            });
        }

        await bookRepo.save(books);

        console.log("✅ Books seeded successfully");
    }
}