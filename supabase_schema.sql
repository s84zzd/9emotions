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

-- 创建策略：仅允许用户访问自己的数据
-- 生产环境：需要启用 Supabase Auth，用户只能读写自己的记录
-- 开发环境临时策略：允许所有人访问（需要在启用认证后删除这些策略）
create policy "Users can view their own check-ins"
on public.check_ins for select
using (auth.uid() = id OR auth.uid() IS NULL); -- 临时允许匿名访问

create policy "Users can insert their own check-ins"
on public.check_ins for insert
with check (auth.uid() = id OR auth.uid() IS NULL); -- 临时允许匿名访问

create policy "Users can update their own check-ins"
on public.check_ins for update
using (auth.uid() = id);

create policy "Users can delete their own check-ins"
on public.check_ins for delete
using (auth.uid() = id);

-- 添加用户 ID 列（为未来的认证系统做准备）
-- alter table public.check_ins add column user_id uuid references auth.users(id);
-- 添加索引以提高查询性能
create index if not exists check_ins_created_at_idx on public.check_ins(created_at desc);
