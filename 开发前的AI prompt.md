You are an AI engineer helping to prototype an emotional health app for young women.

The product has a 4-layer logic + 1 data layer:

------------------------------------------------

[Part 1] Emotion definition (9 emotions)
------------------------------------------------

We define 9 core emotions, grouped into 3 clusters:

Cluster A: "Pressure & Conflict" (high-energy negative)

- 压力 (pressure)
- 焦虑 (anxiety)
- 忧郁 (depressive-heavy)

Cluster B: "Low & Out-of-control" (low-energy negative)

- 疲惫 (fatigue)
- 烦躁 (irritation)
- 无助 (helplessness)

Cluster C: "Positive & Balanced" (positive)

- 期待 (anticipation)
- 平静 (calm)
- 满足 (contentment)

Each emotion is treated as:

- name (string)
- cluster (A/B/C)
- valence: "negative" | "positive"
- typical_energy: "high" | "medium" | "low"

You should define a clean data structure for these 9 emotions.

------------------------------------------------

[Part 2] Energy model + period-level regulation model
------------------------------------------------

We model emotional energy as a daily time series.

Input per period (week or month):

- daily_energy: number[]  // one value per day, 0–100
- daily_emotions: string[] // dominant emotion per day (one of the 9)
- period_type: "week" | "month"

We need to compute:

1) Volatility (V): how much energy fluctuates in this period
   
   - Use standard deviation of daily_energy.
   - Then classify:
     - "low"    if V < 10
     - "medium" if 10 <= V < 20
     - "high"   if V >= 20

2) Trend (ΔE): direction of energy over the period
   
   - Split the period into first half and second half.
   - Compute mean energy of first half: E_first
   - Compute mean energy of second half: E_second
   - ΔE = E_second - E_first
   - Then classify:
     - "positive" if ΔE > +5
     - "neutral"  if -5 <= ΔE <= +5
     - "negative" if ΔE < -5

3) Energy deviation (meanE):
   
   - meanE = average of all daily_energy
   - Define healthy range: 40 <= meanE <= 70
   - Classify:
     - "low"      if meanE < 40
     - "balanced" if 40 <= meanE <= 70
     - "high"     if meanE > 70

4) Period state classification (8–10 states)
   Based on:
   
   - volatility_level: "low" | "medium" | "high"
   - trend_direction: "positive" | "neutral" | "negative"
   - energy_deviation: "low" | "balanced" | "high"
   
   We especially care about:
   
   - low volatility + positive trend        → "stable_positive"
   - low volatility + neutral trend + high energy → "stable_high_energy"
   - low volatility + neutral trend + low energy  → "stable_low_energy"
   - low volatility + negative trend       → "stable_negative"
   - medium volatility + positive trend    → "medium_positive"
   - medium volatility + neutral trend     → "medium_neutral"
   - medium volatility + negative trend    → "medium_negative"
   - high volatility + positive trend      → "high_positive"
   - high volatility + neutral trend       → "high_neutral"
   - high volatility + negative trend      → "high_negative"
   
   Implement:
   
   - calcVolatility(daily_energy) → { V, volatility_level }
   - calcTrend(daily_energy) → { deltaE, trend_direction }
   - calcEnergyDeviation(daily_energy) → { meanE, energy_deviation }
   - classifyPeriodState(volatility_level, trend_direction, energy_deviation) → period_state

5) For each period_state, we need:
   
   - immediate_regulation_tags: string[]  // e.g. ["cool_down", "activate", "maintain", "stabilize"]
   - long_term_regulation_tags: string[]  // e.g. ["reduce_stimulation", "build_rhythm", "increase_rest", "energy_recharge"]

You should implement these as pure functions in TypeScript (or Python), with clear types and comments.

------------------------------------------------

[Part 3] Daily user logging & same-day recommendations
------------------------------------------------

User behavior:

- User can log emotions multiple times per day.
- Each log contains:
  - timestamp
  - 1–2 emotions (from the 9)
  - scene (one of 6 scenes, e.g. "work", "study", "relationship", "family", "alone", "social")

When user logs an emotion, the system should:

1) Generate 3 immediate recommended activities for that moment.
   
   - Based on:
     - emotion
     - its cluster (A/B/C)
     - its typical energy (high/medium/low)
     - scene
   - Activities should be tagged with:
     - regulation_type: "immediate"
     - direction: "cool_down" | "activate" | "maintain" | "stabilize"

2) Allow user to refresh/replace the 3 suggestions.

3) At 21:00 local time each day:
   
   - Generate a "daily emotional report":
     - summarize dominant emotions
     - summarize energy pattern of the day
     - give 2–3 gentle, non-judgmental suggestions for the next day
   - This part can be represented as a function that returns a structured summary object, not just text.

You should design:

- data structures for daily logs
- a function recommendImmediateActivities(log) → Activity[]
- a function generateDailyReport(daily_logs, daily_energy) → DailyReport

------------------------------------------------

[Part 4] Period reports (weekly & monthly)
------------------------------------------------

For each period (week / month), the system should:

1) Use the energy model (Part 2) to compute:
   
   - volatility_level
   - trend_direction
   - energy_deviation
   - period_state

2) Generate a "period emotional report" that includes:
   
   - key metrics (volatility, trend, mean energy)
   - a gentle, non-judgmental summary of the emotional pattern
   - a set of long-term regulation suggestions for the next period
   - a small set of visualization-ready data:
     - daily_energy series
     - maybe counts of each emotion

3) The tone must be:
   
   - warm
   - non-judgmental
   - encouraging
   - focused on "balance" and "gentle adjustment", not "good/bad".

You should design:

- a function generatePeriodReport(daily_energy, daily_emotions, period_type) → PeriodReport
- PeriodReport should be a structured object with:
  - metrics
  - period_state
  - suggested_long_term_actions (tags)
  - text_summaries (can be placeholder strings)
  - chart_data (e.g. arrays ready for plotting)

------------------------------------------------

[Part 5] Activity database (for future expansion)
------------------------------------------------

We will later build a database of at least 10 activities per regulation case.

For now, you should:

- Define a generic Activity type:
  - id
  - name
  - description
  - tags: 
    - regulation_type: "immediate" | "long_term"
    - direction: "cool_down" | "activate" | "maintain" | "stabilize"
    - scenes: string[]  // applicable scenes
    - emotions: string[] // applicable emotions
- Make sure all recommendation functions return activities in terms of these tags, so we can plug in a real database later.

------------------------------------------------

Your tasks
------------------------------------------------

1) Define all core types / interfaces (emotions, logs, activities, reports, metrics).
2) Implement the mathematical model:
   - volatility
   - trend
   - energy deviation
   - period_state classification
3) Implement:
   - recommendImmediateActivities(log)
   - generateDailyReport(daily_logs, daily_energy)
   - generatePeriodReport(daily_energy, daily_emotions, period_type)
4) Make the code modular, readable, and easy to extend.
5) Add comments explaining the logic in simple language, so product and design can understand.

Do NOT focus on UI. Focus on:

- data structures
- pure functions
- clear logic
- extensibility for future activity database.
