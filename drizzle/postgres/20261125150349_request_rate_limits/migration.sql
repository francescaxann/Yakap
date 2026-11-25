CREATE TABLE "rate_limit_buckets" (
	"key" text PRIMARY KEY,
	"hits" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rate_limit_buckets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "rate_limit_buckets_expires_at_idx" ON "rate_limit_buckets" ("expires_at");--> statement-breakpoint
CREATE POLICY "rate_limit_scope" ON "rate_limit_buckets" AS PERMISSIVE FOR ALL TO "yakap_app" USING (current_setting('yakap.scope', true) = 'rate-limit') WITH CHECK (current_setting('yakap.scope', true) = 'rate-limit');--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "rate_limit_buckets" TO "yakap_app";
