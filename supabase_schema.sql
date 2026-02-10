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

-- ⚠️ 开发阶段临时策略：允许所有人访问
-- 这些策略在实施用户认证后必须更新
-- 
-- 说明：当前项目处于开发阶段，尚未实施用户认证系统
-- 因此使用简单的策略允许所有人访问以便开发和测试
-- 
-- 🔒 生产环境安全要求：
-- 1. 添加 user_id 列: alter table public.check_ins add column user_id uuid references auth.users(id);
-- 2. 删除以下临时策略
-- 3. 创建基于 user_id 的策略确保用户只能访问自己的数据

-- 临时策略 1: 允许所有人读取
create policy "temp_allow_read_all"
on public.check_ins for select
using (true);

-- 临时策略 2: 允许所有人插入
create policy "temp_allow_insert_all"
on public.check_ins for insert
with check (true);

-- 临时策略 3: 允许所有人更新
create policy "temp_allow_update_all"
on public.check_ins for update
using (true);

-- 临时策略 4: 允许所有人删除
create policy "temp_allow_delete_all"
on public.check_ins for delete
using (true);

-- 添加索引以提高查询性能
create index if not exists check_ins_created_at_idx on public.check_ins(created_at desc);

-- 📝 未来认证系统策略示例（供参考，当前已注释）:
-- 
-- -- 添加用户 ID 列
-- alter table public.check_ins add column user_id uuid references auth.users(id);
-- 
-- -- 删除所有临时策略
-- drop policy "temp_allow_read_all" on public.check_ins;
-- drop policy "temp_allow_insert_all" on public.check_ins;
-- drop policy "temp_allow_update_all" on public.check_ins;
-- drop policy "temp_allow_delete_all" on public.check_ins;
-- 
-- -- 创建基于用户的策略
-- create policy "users_select_own_checkins"
-- on public.check_ins for select
-- using (auth.uid() = user_id);
-- 
-- create policy "users_insert_own_checkins"
-- on public.check_ins for insert
-- with check (auth.uid() = user_id);
-- 
-- create policy "users_update_own_checkins"
-- on public.check_ins for update
-- using (auth.uid() = user_id);
-- 
-- create policy "users_delete_own_checkins"
-- on public.check_ins for delete
-- using (auth.uid() = user_id);
