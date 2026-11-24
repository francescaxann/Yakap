DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'yakap_app') THEN
        CREATE ROLE "yakap_app" NOLOGIN;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = 'yakap_app'
        AND (rolcanlogin OR rolsuper OR rolbypassrls OR rolcreaterole OR rolcreatedb)
    ) OR EXISTS (
        SELECT 1 FROM pg_auth_members
        WHERE member = 'yakap_app'::regrole
    ) THEN
        RAISE EXCEPTION 'yakap_app must be a restricted application role';
    END IF;
END
$$;--> statement-breakpoint
ALTER TABLE "letters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "moderators" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "auth_scope" ON "account" AS PERMISSIVE FOR ALL TO "yakap_app" USING (current_setting('yakap.scope', true) = 'auth') WITH CHECK (current_setting('yakap.scope', true) = 'auth');--> statement-breakpoint
CREATE POLICY "auth_scope" ON "session" AS PERMISSIVE FOR ALL TO "yakap_app" USING (current_setting('yakap.scope', true) = 'auth') WITH CHECK (current_setting('yakap.scope', true) = 'auth');--> statement-breakpoint
CREATE POLICY "auth_scope" ON "user" AS PERMISSIVE FOR ALL TO "yakap_app" USING (current_setting('yakap.scope', true) = 'auth') WITH CHECK (current_setting('yakap.scope', true) = 'auth');--> statement-breakpoint
CREATE POLICY "scoped_profiles" ON "user" AS PERMISSIVE FOR SELECT TO "yakap_app" USING ("user"."email_verified" AND (
      
  current_setting('yakap.scope', true) = 'moderation' AND EXISTS (
    SELECT 1 FROM public.moderators WHERE email = current_setting('yakap.actor_email', true)
  )
 OR
      (current_setting('yakap.scope', true) = 'submission' AND "user"."id" = current_setting('yakap.actor_id', true) AND "user"."email" = current_setting('yakap.actor_email', true))
    ));--> statement-breakpoint
CREATE POLICY "auth_scope" ON "verification" AS PERMISSIVE FOR ALL TO "yakap_app" USING (current_setting('yakap.scope', true) = 'auth') WITH CHECK (current_setting('yakap.scope', true) = 'auth');--> statement-breakpoint
CREATE POLICY "read_memberships" ON "moderators" AS PERMISSIVE FOR SELECT TO "yakap_app" USING (current_setting('yakap.scope', true) IN ('bootstrap', 'manage-moderators') OR (
      current_setting('yakap.scope', true) IN ('membership', 'moderation') AND "moderators"."email" = current_setting('yakap.actor_email', true)
    ));--> statement-breakpoint
CREATE POLICY "add_membership" ON "moderators" AS PERMISSIVE FOR INSERT TO "yakap_app" WITH CHECK (current_setting('yakap.scope', true) IN ('bootstrap', 'manage-moderators'));--> statement-breakpoint
CREATE POLICY "remove_other_membership" ON "moderators" AS PERMISSIVE FOR DELETE TO "yakap_app" USING (current_setting('yakap.scope', true) = 'manage-moderators' AND "moderators"."email" <> current_setting('yakap.actor_email', true));--> statement-breakpoint
CREATE POLICY "read_visible_letters" ON "letters" AS PERMISSIVE FOR SELECT TO "yakap_app" USING ((current_setting('yakap.scope', true) = 'public' AND "letters"."status" = 'approved') OR (current_setting('yakap.scope', true) = 'submission' AND "letters"."sender_id" = current_setting('yakap.actor_id', true) AND "letters"."sender_email" = current_setting('yakap.actor_email', true)) OR (
  current_setting('yakap.scope', true) = 'moderation' AND EXISTS (
    SELECT 1 FROM public.moderators WHERE email = current_setting('yakap.actor_email', true)
  )
));--> statement-breakpoint
CREATE POLICY "submit_own_pending_letter" ON "letters" AS PERMISSIVE FOR INSERT TO "yakap_app" WITH CHECK ((current_setting('yakap.scope', true) = 'submission' AND "letters"."sender_id" = current_setting('yakap.actor_id', true) AND "letters"."sender_email" = current_setting('yakap.actor_email', true)) AND "letters"."status" = 'pending' AND EXISTS (
        SELECT 1 FROM public."user" WHERE id = current_setting('yakap.actor_id', true) AND email = current_setting('yakap.actor_email', true) AND email_verified
      ));--> statement-breakpoint
CREATE POLICY "moderate_letters" ON "letters" AS PERMISSIVE FOR UPDATE TO "yakap_app" USING ((
  current_setting('yakap.scope', true) = 'moderation' AND EXISTS (
    SELECT 1 FROM public.moderators WHERE email = current_setting('yakap.actor_email', true)
  )
) AND "letters"."status" <> 'deleted') WITH CHECK ((
  current_setting('yakap.scope', true) = 'moderation' AND EXISTS (
    SELECT 1 FROM public.moderators WHERE email = current_setting('yakap.actor_email', true)
  )
) AND "letters"."status" IN ('approved', 'declined', 'deleted'));--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO "yakap_app";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "account", "session", "user", "verification" TO "yakap_app";--> statement-breakpoint
GRANT SELECT, INSERT ON TABLE "letters" TO "yakap_app";--> statement-breakpoint
GRANT UPDATE ("status") ON TABLE "letters" TO "yakap_app";--> statement-breakpoint
GRANT USAGE ON SEQUENCE "letters_id_seq" TO "yakap_app";--> statement-breakpoint
GRANT SELECT, INSERT, DELETE ON TABLE "moderators" TO "yakap_app";--> statement-breakpoint
GRANT "yakap_app" TO CURRENT_USER WITH SET TRUE;
