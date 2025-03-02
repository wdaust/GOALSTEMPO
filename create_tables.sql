-- Create tables for KHGoals app

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  deadline TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subgoals table
CREATE TABLE IF NOT EXISTS public.subgoals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit completions table
CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  prompt_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accountability partners table
CREATE TABLE IF NOT EXISTS public.accountability_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  status TEXT NOT NULL,
  share_habits BOOLEAN DEFAULT TRUE,
  share_goals BOOLEAN DEFAULT TRUE,
  share_journal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subgoals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountability_partners ENABLE ROW LEVEL SECURITY;

-- Create policies for goals table
CREATE POLICY Users can view their own goals ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY Users can insert their own goals ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY Users can update their own goals ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY Users can delete their own goals ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for subgoals table
CREATE POLICY Users can view their own subgoals ON public.subgoals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.goals
      WHERE goals.id = subgoals.goal_id AND goals.user_id = auth.uid()
    )
  );

CREATE POLICY Users can insert their own subgoals ON public.subgoals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.goals
      WHERE goals.id = subgoals.goal_id AND goals.user_id = auth.uid()
    )
  );

CREATE POLICY Users can update their own subgoals ON public.subgoals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.goals
      WHERE goals.id = subgoals.goal_id AND goals.user_id = auth.uid()
    )
  );

CREATE POLICY Users can delete their own subgoals ON public.subgoals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.goals
      WHERE goals.id = subgoals.goal_id AND goals.user_id = auth.uid()
    )
  );

-- Create policies for habits table
CREATE POLICY Users can view their own habits ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY Users can insert their own habits ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY Users can update their own habits ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY Users can delete their own habits ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for habit_completions table
CREATE POLICY Users can view their own habit completions ON public.habit_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY Users can insert their own habit completions ON public.habit_completions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY Users can update their own habit completions ON public.habit_completions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY Users can delete their own habit completions ON public.habit_completions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()
    )
  );

-- Create policies for journal_entries table
CREATE POLICY Users can view their own journal entries ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY Users can insert their own journal entries ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY Users can update their own journal entries ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY Users can delete their own journal entries ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for accountability_partners table
CREATE POLICY Users can view their own accountability partners ON public.accountability_partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY Users can insert their own accountability partners ON public.accountability_partners
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY Users can update their own accountability partners ON public.accountability_partners
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY Users can delete their own accountability partners ON public.accountability_partners
  FOR DELETE USING (auth.uid() = user_id);

