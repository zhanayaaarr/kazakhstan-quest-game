CREATE TABLE public.game_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  rank TEXT,
  levels_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.game_results TO anon;
GRANT SELECT, INSERT ON public.game_results TO authenticated;
GRANT ALL ON public.game_results TO service_role;

ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Game results are viewable by everyone"
ON public.game_results FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own game results"
ON public.game_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_game_results_score ON public.game_results (score DESC);
CREATE INDEX idx_game_results_user ON public.game_results (user_id);