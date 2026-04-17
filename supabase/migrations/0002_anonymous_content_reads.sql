-- EPT-Kompass — public-anon read access to content tables.
--
-- Rationale: the MVP skips auth and runs the app anonymously. The default
-- RLS policies in 0001_init require `auth.role() = 'authenticated'`, which
-- means anon requests (the default browser session before login) would be
-- blocked from reading content.
--
-- This migration keeps the authenticated-read policy from 0001 and ADDS a
-- permissive read policy for the `anon` role on content-only tables. No
-- write policy is added — content remains write-protected against the
-- service role. Per-user tables (user_progress, exercise_attempts,
-- srs_cards, study_plan, lesson_notes, past_exams, past_exam_questions,
-- discussions) keep their strict ownership policies.
--
-- Safe to reverse by dropping the new policies.

begin;

create policy "tracks_read_anon"    on public.tracks         for select to anon using (true);
create policy "modules_read_anon"   on public.modules        for select to anon using (true);
create policy "chapters_read_anon"  on public.chapters       for select to anon using (true);
create policy "lessons_read_anon"   on public.lessons        for select to anon using (true);
create policy "formulas_read_anon"  on public.formulas       for select to anon using (true);
create policy "glossary_read_anon"  on public.glossary_terms for select to anon using (true);
create policy "exercises_read_anon" on public.exercises      for select to anon using (true);

-- Public, non-hidden discussion rows are readable anonymously so an
-- unauthenticated visitor can still see what the community posted. Write
-- policies still require authenticated ownership.
create policy "discussions_read_anon" on public.discussions
  for select to anon using (hidden = false);

commit;
