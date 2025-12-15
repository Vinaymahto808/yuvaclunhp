CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: doubt_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doubt_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    doubt_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    is_accepted boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: doubts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doubts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    subject text,
    is_resolved boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    image_url text NOT NULL,
    caption text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: study_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_materials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    subject text NOT NULL,
    file_url text,
    material_type text DEFAULT 'notes'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    video_url text NOT NULL,
    title text NOT NULL,
    thumbnail_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: doubt_answers doubt_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doubt_answers
    ADD CONSTRAINT doubt_answers_pkey PRIMARY KEY (id);


--
-- Name: doubts doubts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doubts
    ADD CONSTRAINT doubts_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: study_materials study_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_materials
    ADD CONSTRAINT study_materials_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: doubt_answers doubt_answers_doubt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doubt_answers
    ADD CONSTRAINT doubt_answers_doubt_id_fkey FOREIGN KEY (doubt_id) REFERENCES public.doubts(id) ON DELETE CASCADE;


--
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: videos videos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: doubt_answers Anyone can view answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view answers" ON public.doubt_answers FOR SELECT USING (true);


--
-- Name: doubts Anyone can view doubts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view doubts" ON public.doubts FOR SELECT USING (true);


--
-- Name: study_materials Anyone can view materials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view materials" ON public.study_materials FOR SELECT USING (true);


--
-- Name: doubt_answers Authenticated users can create answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create answers" ON public.doubt_answers FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: doubts Authenticated users can create doubts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create doubts" ON public.doubts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: posts Authenticated users can create posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: messages Authenticated users can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can send messages" ON public.messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: study_materials Authenticated users can upload materials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can upload materials" ON public.study_materials FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: videos Authenticated users can upload videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can upload videos" ON public.videos FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: messages Messages are viewable by authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Messages are viewable by authenticated users" ON public.messages FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: posts Posts are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);


--
-- Name: profiles Profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);


--
-- Name: doubt_answers Users can delete their own answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own answers" ON public.doubt_answers FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: doubts Users can delete their own doubts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own doubts" ON public.doubts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: study_materials Users can delete their own materials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own materials" ON public.study_materials FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: posts Users can delete their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: videos Users can delete their own videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own videos" ON public.videos FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: doubt_answers Users can update their own answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own answers" ON public.doubt_answers FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: doubts Users can update their own doubts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own doubts" ON public.doubts FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: study_materials Users can update their own materials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own materials" ON public.study_materials FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: videos Videos are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Videos are viewable by everyone" ON public.videos FOR SELECT USING (true);


--
-- Name: doubt_answers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.doubt_answers ENABLE ROW LEVEL SECURITY;

--
-- Name: doubts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: study_materials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

--
-- Name: videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


