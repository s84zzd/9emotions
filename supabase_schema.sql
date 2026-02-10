-- 创建 check_ins 表
create table public.check_ins (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  emotions text[] not null, -- 存储情绪数组，如 ["Anxiety", "Stress"]
  scene text not null,      -- 存储场景ID，如 "work"
  energy_score float,       -- 能量分数（可选，可由后端计算或前端传入）
  note text                 -- 备注（预留）
);

-- 开启行级安全 (RLS)
alter table public.check_ins enable row level security;

-- 创建策略：允许匿名用户读写（开发阶段方便调试）
-- 注意：生产环境应配合 Auth 使用
create policy "Enable read access for all users"
on public.check_ins for select
using (true);

create policy "Enable insert access for all users"
on public.check_ins for insert
with check (true);
