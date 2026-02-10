-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (extends Supabase auth.users)
-- 存放用户基本信息，与 Supabase Auth 联动
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Scenes Table (Dimension/Lookup)
-- 场景维度表：定义 6 大场景 (Work, Study, Relationship, Family, Alone, Social)
create table public.scenes (
  id text primary key, -- 标识符，如 'work', 'study'
  name text not null, -- 显示名称，如 '工作', '学习'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Activities Table (Recommendation Library)
-- 推荐活动库：存放所有可推荐的减压/激活活动
create table public.activities (
  id text primary key, -- 格式如 'ACT-WORK-CD-01'
  name text not null, -- 活动名称
  description text, -- 活动简述
  direction text check (direction in ('cool_down', 'activate', 'maintain', 'stabilize')) not null, -- 能量调节方向
  scenes text[] not null, -- 适用场景数组
  duration_min int default 5, -- 预计耗时
  intensity text check (intensity in ('low', 'medium', 'high')) default 'low', -- 强度
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Check-ins Table (Emotion Logs)
-- 情绪打卡表：记录用户每次打卡的情绪状态和场景
create table public.check_ins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  
  -- 情绪列表 (数组，如 ['anxiety', 'stress'])
  emotions text[] not null, 
  
  -- 关联场景
  scene_id text not null,
  
  -- 推荐结果 (记录当时推荐了什么，可选)
  recommended_activity_ids text[],
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Reports Table (Cache)
-- 报表缓存表：存储生成的周报/月报 JSON 数据，避免重复计算
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  
  -- 报表类型
  report_type text check (report_type in ('weekly', 'monthly')) not null,
  
  -- 统计周期
  period_start date not null,
  period_end date not null,
  
  -- 统计结果 (JSONB 格式，包含情绪占比、趋势点等)
  summary_data jsonb not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index emotions_user_id_idx on public.emotions(user_id);
create index emotions_created_at_idx on public.emotions(created_at);
create index reports_user_id_period_idx on public.reports(user_id, period_start, period_end);
