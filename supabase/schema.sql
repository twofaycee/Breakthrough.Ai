create table if not exists films (id text primary key, title text, genre text, synopsis text, video_url text, views int default 0, featured_score numeric default 0, status text default 'live', scheduled_release_at timestamp, expires_at timestamp, created_at timestamp default now());
insert into storage.buckets (id,name,public) values ('films','films',true) on conflict (id) do nothing;
