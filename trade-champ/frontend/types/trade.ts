export type Trade = {
  id: number;
  ticket: number;
  symbol: string;
  strategy_tag: string | null;
  profit: number;
  open_time: string;
  entry_price: number;
  exit_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  trade_duration_minutes: number | null;
  notes?: string;
  screenshot_url?: string;
};
