CREATE TABLE "moderators" (
	"email" text PRIMARY KEY
);
--> statement-breakpoint
ALTER TABLE "letters" ADD COLUMN "sender_id" text;--> statement-breakpoint
CREATE INDEX "letters_sender_id_idx" ON "letters" ("sender_id");--> statement-breakpoint
ALTER TABLE "letters" ADD CONSTRAINT "letters_sender_id_user_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE SET NULL;