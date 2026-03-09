-- AlterTable
ALTER TABLE "Ministry" ADD COLUMN IF NOT EXISTS "slug" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Ministry" ADD COLUMN IF NOT EXISTS "fullContent" TEXT;
ALTER TABLE "Ministry" ADD COLUMN IF NOT EXISTS "mission" TEXT;
ALTER TABLE "Ministry" ADD COLUMN IF NOT EXISTS "bannerImage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Ministry_slug_key" ON "Ministry"("slug");
CREATE INDEX IF NOT EXISTS "Ministry_slug_idx" ON "Ministry"("slug");
