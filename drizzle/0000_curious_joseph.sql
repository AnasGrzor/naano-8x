CREATE TABLE "creator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_key" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"name" text,
	"headline" text,
	"location" text,
	"avatar_url" text,
	"followers" integer,
	"experience" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creator_profiles_owner_key_unique" UNIQUE("owner_key")
);
--> statement-breakpoint
CREATE TABLE "linkedin_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"external_id" text NOT NULL,
	"url" text,
	"text" text,
	"published_at" timestamp with time zone,
	"reactions" integer,
	"comments" integer,
	"shares" integer,
	"is_repost" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "linkedin_posts_profile_id_external_id_unique" UNIQUE("profile_id","external_id")
);
--> statement-breakpoint
ALTER TABLE "linkedin_posts" ADD CONSTRAINT "linkedin_posts_profile_id_creator_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."creator_profiles"("id") ON DELETE cascade ON UPDATE no action;