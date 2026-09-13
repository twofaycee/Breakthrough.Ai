create table if not exists films (id text primary key, title text, genre text, synopsis text, video_url text, match int, views int default 0, likes int default 0, featured_score numeric default 0, status text default 'live', scheduled_release_at timestamp, expires_at timestamp, created_at timestamp default now());
create table if not exists generations (id uuid primary key default gen_random_uuid(), prompt text, genre text, status text, video_url text, created_at timestamp default now());
create table if not exists watch_events (id uuid primary key default gen_random_uuid(), film_id text, genre text, watch_duration int, created_at timestamp default now());
insert into storage.buckets (id,name,public) values ('films','films',true) on conflict do nothing;
