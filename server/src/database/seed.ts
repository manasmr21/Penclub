import dataSource  from "../config/typeorm.config";
import { BookSeeder } from "../modules/books/books.seeder";

async function seed() {
    await dataSource.initialize();

    console.log("🌱 Seeding started...");

    const bookSeeder = new BookSeeder();
    await bookSeeder.run(dataSource);

    console.log("🌱 Seeding completed");

    process.exit(0);
}

seed();