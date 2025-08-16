import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordColumn1703000000001 implements MigrationInterface {
    name = 'AddPasswordColumn1703000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add password column if it doesn't exist
        const hasPassword = await queryRunner.hasColumn("users", "password");
        if (!hasPassword) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "password" character varying(255) NOT NULL DEFAULT ''
            `);
        }

        // Add other missing columns
        const hasPhone = await queryRunner.hasColumn("users", "phone");
        if (!hasPhone) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "phone" character varying(20)
            `);
        }

        const hasAvatar = await queryRunner.hasColumn("users", "avatar");
        if (!hasAvatar) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "avatar" text
            `);
        }

        const hasRole = await queryRunner.hasColumn("users", "role");
        if (!hasRole) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "role" character varying DEFAULT 'customer'
            `);
        }

        const hasStatus = await queryRunner.hasColumn("users", "status");
        if (!hasStatus) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "status" character varying DEFAULT 'pending'
            `);
        }

        const hasIsEmailVerified = await queryRunner.hasColumn("users", "isEmailVerified");
        if (!hasIsEmailVerified) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "isEmailVerified" boolean DEFAULT false
            `);
        }

        const hasIsPhoneVerified = await queryRunner.hasColumn("users", "isPhoneVerified");
        if (!hasIsPhoneVerified) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "isPhoneVerified" boolean DEFAULT false
            `);
        }

        const hasLoyaltyPoints = await queryRunner.hasColumn("users", "loyaltyPoints");
        if (!hasLoyaltyPoints) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "loyaltyPoints" integer DEFAULT 0
            `);
        }

        const hasLastLogin = await queryRunner.hasColumn("users", "lastLogin");
        if (!hasLastLogin) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "lastLogin" timestamp
            `);
        }

        const hasEmailVerificationToken = await queryRunner.hasColumn("users", "emailVerificationToken");
        if (!hasEmailVerificationToken) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "emailVerificationToken" character varying(255)
            `);
        }

        const hasEmailVerificationExpires = await queryRunner.hasColumn("users", "emailVerificationExpires");
        if (!hasEmailVerificationExpires) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "emailVerificationExpires" timestamp
            `);
        }

        const hasPasswordResetToken = await queryRunner.hasColumn("users", "passwordResetToken");
        if (!hasPasswordResetToken) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "passwordResetToken" character varying(255)
            `);
        }

        const hasPasswordResetExpires = await queryRunner.hasColumn("users", "passwordResetExpires");
        if (!hasPasswordResetExpires) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "passwordResetExpires" timestamp
            `);
        }

        const hasPreferences = await queryRunner.hasColumn("users", "preferences");
        if (!hasPreferences) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "preferences" jsonb
            `);
        }

        const hasAddress = await queryRunner.hasColumn("users", "address");
        if (!hasAddress) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "address" jsonb
            `);
        }

        const hasCreatedAt = await queryRunner.hasColumn("users", "createdAt");
        if (!hasCreatedAt) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
            `);
        }

        const hasUpdatedAt = await queryRunner.hasColumn("users", "updatedAt");
        if (!hasUpdatedAt) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns in reverse order
        const columns = [
            'updatedAt', 'createdAt', 'address', 'preferences', 
            'passwordResetExpires', 'passwordResetToken', 
            'emailVerificationExpires', 'emailVerificationToken',
            'lastLogin', 'loyaltyPoints', 'isPhoneVerified', 'isEmailVerified',
            'status', 'role', 'avatar', 'phone', 'password'
        ];

        for (const column of columns) {
            const hasColumn = await queryRunner.hasColumn("users", column);
            if (hasColumn) {
                await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "${column}"`);
            }
        }
    }
}
