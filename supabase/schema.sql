
-- BREAKTHROUGH.AI FINAL SCHEMA - VALIDATED FOR DEPLOY
create extension if not exists pgcrypto;
create table if not exists films (
  id text primary key,
  title text,
  genre text,
  synopsis text,
  video_url text,
  match int default 90,
  views int default 0,
  likes int default 0,
  watch_time int default 0,
  featured_score numeric default 0,
  status text default 'live',
  scheduled_release_at timestamp default now(),
  expires_at timestamp default now() + interval '30 days',
  created_at timestamp default now()
);
create table if not exists profiles (id uuid primary key default gen_random_uuid(), watched_genres jsonb default '{}');
create table if not exists generations (id uuid primary key default gen_random_uuid(), prompt text, genre text, status text default 'queued', video_url text, created_at timestamp default now());
create table if not exists watch_events (id uuid primary key default gen_random_uuid(), film_id text, genre text, watch_duration int default 0, created_at timestamp default now());
insert into storage.buckets (id,name,public) values ('films','films',true) on conflict (id) do nothing;
