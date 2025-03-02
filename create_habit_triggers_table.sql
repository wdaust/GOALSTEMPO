-- Create the habit_triggers table to store trigger tags and their counts
CREATE TABLE IF NOT EXISTS habit_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  trigger_text TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster lookups by habit_id
CREATE INDEX IF NOT EXISTS habit_triggers_habit_id_idx ON habit_triggers(habit_id);

-- Enable row-level security
ALTER TABLE habit_triggers ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting triggers (users can only see their own triggers)
CREATE POLICY habit_triggers_select_policy ON habit_triggers 
  FOR SELECT USING (
    habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())
  );

-- Create policy for inserting triggers
CREATE POLICY habit_triggers_insert_policy ON habit_triggers 
  FOR INSERT WITH CHECK (
    habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())
  );

-- Create policy for updating triggers
CREATE POLICY habit_triggers_update_policy ON habit_triggers 
  FOR UPDATE USING (
    habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())
  );

-- Create policy for deleting triggers
CREATE POLICY habit_triggers_delete_policy ON habit_triggers 
  FOR DELETE USING (
    habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())
  );

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE habit_triggers;
