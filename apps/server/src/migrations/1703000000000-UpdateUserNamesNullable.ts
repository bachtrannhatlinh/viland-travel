import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserNamesNullable1703000000000 implements MigrationInterface {
    name = 'UpdateUserNamesNullable1703000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if firstName column exists, if not add it
        const hasFirstName = await queryRunner.hasColumn("users", "firstName");
        if (!hasFirstName) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "firstName" character varying(100)
            `);
        }

        // Check if lastName column exists, if not add it
        const hasLastName = await queryRunner.hasColumn("users", "lastName");
        if (!hasLastName) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "lastName" character varying(100)
            `);
        }

        // Update existing null values with default values
        await queryRunner.query(`
            UPDATE "users"
            SET "firstName" = 'Unknown'
            WHERE "firstName" IS NULL
        `);

        await queryRunner.query(`
            UPDATE "users"
            SET "lastName" = 'User'
            WHERE "lastName" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the columns if they exist
        const hasFirstName = await queryRunner.hasColumn("users", "firstName");
        if (hasFirstName) {
            await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        }

        const hasLastName = await queryRunner.hasColumn("users", "lastName");
        if (hasLastName) {
            await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        }
    }
}
