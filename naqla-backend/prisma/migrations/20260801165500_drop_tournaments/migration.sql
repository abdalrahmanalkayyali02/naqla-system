-- DropForeignKey
ALTER TABLE "tournament_participants" DROP CONSTRAINT "tournament_participants_tournament_id_fkey";

-- DropForeignKey
ALTER TABLE "tournament_participants" DROP CONSTRAINT "tournament_participants_user_id_fkey";

-- DropTable
DROP TABLE "tournament_participants";

-- DropTable
DROP TABLE "tournaments";

-- DropEnum
DROP TYPE "TournamentRole";

