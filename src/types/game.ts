export enum TransactionType {
  TRANSACTION_TYPE_BET_PLACED = "TRANSACTION_TYPE_BET_PLACED",
  TRANSACTION_TYPE_BET_HIT = "TRANSACTION_TYPE_BET_HIT",
  TRANSACTION_TYPE_REBUY = "TRANSACTION_TYPE_REBUY",
}

export enum RouteId {
  ROUTE_ID_1 = "1",
  ROUTE_ID_2 = "2",
  ROUTE_ID_3 = "3",
  ROUTE_ID_4 = "4",
  ROUTE_ID_5 = "5",
  ROUTE_ID_6 = "6",
  ROUTE_ID_7 = "7",
  ROUTE_ID_A = "A",
  ROUTE_ID_B = "B",
  ROUTE_ID_C = "C",
  ROUTE_ID_D = "D",
  ROUTE_ID_E = "E",
  ROUTE_ID_F = "F",
  ROUTE_ID_G = "G",
  ROUTE_ID_J = "J",
  ROUTE_ID_L = "L",
  ROUTE_ID_M = "M",
  ROUTE_ID_N = "N",
  ROUTE_ID_Q = "Q",
  ROUTE_ID_R = "R",
  ROUTE_ID_W = "W",
  ROUTE_ID_Z = "Z",
}

export enum GameType {
  GAME_TYPE_IRT_SYSTEM = "GAME_TYPE_IRT_SYSTEM",
  GAME_TYPE_BMT_SYSTEM = "GAME_TYPE_BMT_SYSTEM",
  GAME_TYPE_IND_SYSTEM = "GAME_TYPE_IND_SYSTEM",
  GAME_TYPE_SYSTEM_CHAMPIONSHIP = "GAME_TYPE_SYSTEM_CHAMPIONSHIP",
  GAME_TYPE_FREE_FOR_ALL = "GAME_TYPE_FREE_FOR_ALL",
}

export enum GameVariant {
  GAME_VARIANT_WEEKDAY = "GAME_VARIANT_WEEKDAY",
  GAME_VARIANT_WEEKEND = "GAME_VARIANT_WEEKEND",
}

export enum GameStatus {
  GAME_STATUS_NOT_STARTED = "GAME_STATUS_NOT_STARTED",
  GAME_STATUS_UNDERWAY = "GAME_STATUS_UNDERWAY",
  GAME_STATUS_FINISHED = "GAME_STATUS_FINISHED",
}

export enum TripStatus {
  TRIP_STATUS_NOT_SEEN_YET = "TRIP_STATUS_NOT_SEEN_YET",
  TRIP_STATUS_UNDERWAY = "TRIP_STATUS_UNDERWAY",
  TRIP_STATUS_DISAPPEARED = "TRIP_STATUS_DISAPPEARED",
}

export enum RouteStatus {
  ROUTE_STATUS_NO_TRIP_SELECTED = "ROUTE_STATUS_NO_TRIP_SELECTED",
  ROUTE_STATUS_UNDERWAY = "ROUTE_STATUS_UNDERWAY",
  ROUTE_STATUS_COMPLETE = "ROUTE_STATUS_REACHED_TARGET",
  ROUTE_STATUS_DQ = "ROUTE_STATUS_DQ",
}

export enum DqReason {
  DQ_REASON_NO_CANDIDATES = "DQ_REASON_NO_CANDIDATES",
  DQ_REASON_TRIP_NEVER_SELECTED = "DQ_REASON_TRIP_NEVER_SELECTED",
  DQ_REASON_TOO_SLOW = "DQ_REASON_TOO_SLOW",
  DQ_REASON_DISAPPEARED = "DQ_REASON_DISAPPEARED",
}

export enum RankingStatus {
  RANKING_STATUS_UNRANKED = "RANKING_STATUS_UNRANKED",
  RANKING_STATUS_RANKED = "RANKING_STATUS_RANKED",
}

export interface Stop {
  stop_id: string;
  stop_name: string;
  stop_sequence: number;
  scheduled_arrival_time_s: number;
  actual_arrival_time_s?: number;
}

export interface TripData {
  trip_id: string;
  trip_id_short: string;
  trip_status: TripStatus;
  stops: Stop[];
  target_stop: Stop;
  actual_target_arrival_time_s: number;
  last_seen_timestamp?: number;
  must_reappear_by_s?: number;
}

export interface Ranking {
  rank?: number;
  ranking_status: RankingStatus;
}

export interface Route {
  route_id: RouteId;
  candidate_trips?: TripData[];
  selected_trip?: TripData;
  ranking: Ranking;
  route_status: RouteStatus;
  dq_reason?: DqReason;
}

export interface Game {
  game_id: string;
  date: string;
  week_number: number;
  game_type: GameType;
  game_variant: GameVariant;
  game_status: GameStatus;
  betting_window_open_timestamp: string;
  betting_window_close_timestamp: string;
  game_ended_timestamp?: string;
  winner_route_id?: RouteId;
  paid_out?: boolean;
  target_time_s: number;
  realtime_routes_data?: Route[];
  dependency_game_ids?: string[];
  include_winner_in_game_ids?: string[];
  exclude_winner_from_game_ids?: string[];
  enables_game_ids?: string[];
  earliest_prep_time: string;
  game_window_start_s: number;
  game_window_end_s: number;
}

export interface User {
  user_id: string;
  username: string;
  date_joined?: string;
  num_tokens: number;
  num_rebuys?: number;
  local_routes?: string;
}

export interface Bet {
  bet_id?: string;
  user_id: string;
  game_id: string;
  route_id: RouteId;
  amount: number;
  payout?: number;
  created_at?: string;
}

export interface Transaction {
  transaction_id?: string;
  user_id: string;
  transaction_type: TransactionType;
  amount: number;
  created_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  num_tokens: number;
  num_rebuys: number;
}
