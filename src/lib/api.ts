import { Game, User, Bet, Transaction, LeaderboardEntry } from '@/types/game';

const API_BASE = '/api/proxy';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('session_token');
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || `Request failed with status ${response.status}` };
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const api = {
  login: (username: string, password: string) =>
    apiRequest<{ session_token: string; user_id: string; username: string; num_tokens: number }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string, local_routes?: string) =>
    apiRequest<{ user_id: string; username: string; num_tokens: number }>('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password, local_routes }),
    }),

  getCurrentUser: () =>
    apiRequest<User>('/users/me'),

  getGames: (params?: { limit?: number; offset?: number; order?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ games: Game[]; count: number; limit: number; offset: number }>(`/games${query ? `?${query}` : ''}`);
  },

  getGameById: (gameId: string) =>
    apiRequest<Game>(`/games/${gameId}`),

  getGameBetSummary: (gameId: string) =>
    apiRequest<any>(`/games/${gameId}/bet_summary`),

  getUserBets: (params?: { status?: string; game_id?: string; limit?: number; offset?: number; order?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ bets: Bet[]; count: number }>(`/users/me/bets${query ? `?${query}` : ''}`);
  },

  placeBet: (gameId: string, routeId: string, amount: number) =>
    apiRequest<{ message: string; game_id: string; route_id: string; amount: number; balance_after: number }>('/users/me/bets', {
      method: 'POST',
      body: JSON.stringify({ game_id: gameId, route_id: routeId, amount }),
    }),

  getUserTransactions: (params?: { limit?: number; offset?: number; order?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ transactions: Transaction[]; count: number }>(`/users/me/transactions${query ? `?${query}` : ''}`);
  },

  rebuy: () =>
    apiRequest<{ message: string; amount: number; balance_after: number; num_rebuys: number }>('/users/me/rebuys', {
      method: 'POST',
    }),

  getLeaderboard: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest<{ leaderboard: LeaderboardEntry[]; total_entries: number }>(`/leaderboard${query}`);
  },
};
