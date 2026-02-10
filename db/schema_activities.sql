-- 创建 activities 表
create table public.activities (
  id text primary key,           -- 使用原有 ID (如 ACT-WORK-CD-01)
  name text not null,
  description text,
  direction text not null,       -- cool_down, activate, stabilize, maintain
  scenes text[] not null,        -- work, home, social, etc.
  duration_min int not null,
  intensity text not null,       -- low, medium, high
  created_at timestamptz default now() not null
);

-- 开启 RLS
alter table public.activities enable row level security;

-- 允许所有用户读取 (公开活动库)
create policy "Enable read access for all users"
on public.activities for select
using (true);

-- 允许所有用户插入 (开发阶段方便导入，生产环境应限制)
create policy "Enable insert access for all users"
on public.activities for insert
with check (true);
