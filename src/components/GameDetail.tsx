'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import styles from './GameDetail.module.css';

interface GameDetailProps {
  gameId: string;
  onBack: () => void;
  onBetPlaced: () => void;
}

export default function GameDetail({ gameId, onBack, onBetPlaced }: GameDetailProps) {
  const [game, setGame] = useState<any>(null);
  const [betSummary, setBetSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [betting, setBetting] = useState(false);
  const [betError, setBetError] = useState('');
  const [betSuccess, setBetSuccess] = useState('');
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes(prev => {
      const next = new Set(prev);
      if (next.has(routeId)) {
        next.delete(routeId);
      } else {
        next.add(routeId);
      }
      return next;
    });
  };

  useEffect(() => {
    loadGameData();
  }, [gameId]);

  const loadGameData = async () => {
    setLoading(true);
    const [gameResult, summaryResult] = await Promise.all([
      api.getGameById(gameId),
      api.getGameBetSummary(gameId),
    ]);

    if (gameResult.error) {
      setError(gameResult.error);
    } else if (gameResult.data) {
      setGame(gameResult.data);
    }

    if (summaryResult.data) {
      setBetSummary(summaryResult.data);
    }

    setLoading(false);
  };

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    setBetError('');
    setBetSuccess('');
    setBetting(true);

    const result = await api.placeBet(gameId, selectedRoute, parseInt(betAmount));
    if (result.error) {
      setBetError(result.error);
    } else if (result.data) {
      setBetSuccess(`Bet placed! New balance: ${result.data.balance_after}`);
      setBetAmount('');
      setSelectedRoute('');
      onBetPlaced();
      loadGameData();
    }

    setBetting(false);
  };

  if (loading) return <div>Loading game...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>Game not found</div>;

  const routes = game.realtime_routes_data || [];

  const now = new Date();
  const bettingOpen = new Date(game.betting_window_open_timestamp);
  const bettingClose = new Date(game.betting_window_close_timestamp);
  const isBettingOpen = now >= bettingOpen && now <= bettingClose;
  const bettingStatus = now < bettingOpen
    ? 'Not yet open'
    : now > bettingClose
    ? 'Closed'
    : 'Open';

  return (
    <div className={styles.container}>
      <button onClick={onBack}>Back to Games</button>
      <h2>Game {game.game_id}</h2>
      <div>Date: {game.date}</div>
      <div>Week: {game.week_number}</div>
      <div>Type: {game.game_type}</div>
      <div>Status: {game.game_status}</div>
      <div>Betting Window: {game.betting_window_open_timestamp} to {game.betting_window_close_timestamp}</div>
      <div>Betting Status: <strong>{bettingStatus}</strong></div>

      <h3>Routes</h3>
      <div className={styles.routes}>
        {routes.map((route: any) => {
          const isExpanded = expandedRoutes.has(route.route_id);
          const selectedTrip = route.selected_trip;

          return (
            <div key={route.route_id} className={styles.route}>
              <div className={styles.routeHeader} onClick={() => toggleRoute(route.route_id)}>
                <span>{isExpanded ? '▼' : '▶'}</span>
                <strong>Route {route.route_id}</strong>
                <span>Status: {route.route_status}</span>
                {route.ranking?.rank && <span>Rank: {route.ranking.rank}</span>}
                {betSummary?.route_summaries?.[route.route_id] && (
                  <span>Bets: {betSummary.route_summaries[route.route_id].total_amount}</span>
                )}
              </div>

              {isExpanded && (
                <div className={styles.routeDetails}>
                  {route.dq_reason && <div>DQ Reason: {route.dq_reason}</div>}

                  {selectedTrip && (
                    <div className={styles.tripSection}>
                      <h4>Selected Trip</h4>
                      <div>Trip ID: {selectedTrip.trip_id}</div>
                      <div>Status: {selectedTrip.trip_status}</div>
                      <div>Target Arrival: {selectedTrip.actual_target_arrival_time_s}s</div>

                      <h5>Stops ({selectedTrip.stops?.length || 0})</h5>
                      <div className={styles.stops}>
                        {selectedTrip.stops?.map((stop: any) => (
                          <div key={stop.stop_id} className={styles.stop}>
                            <div>{stop.stop_name} ({stop.stop_id})</div>
                            <div>Seq: {stop.stop_sequence}</div>
                            <div>Scheduled: {stop.scheduled_arrival_time_s}s</div>
                            {stop.actual_arrival_time_s && (
                              <div>Actual: {stop.actual_arrival_time_s}s</div>
                            )}
                          </div>
                        ))}
                      </div>

                      <h5>Target Stop</h5>
                      <div className={styles.targetStop}>
                        <div>{selectedTrip.target_stop?.stop_name}</div>
                        <div>Scheduled: {selectedTrip.target_stop?.scheduled_arrival_time_s}s</div>
                      </div>
                    </div>
                  )}

                  {route.candidate_trips && route.candidate_trips.length > 0 && (
                    <div className={styles.candidatesSection}>
                      <h4>Candidate Trips ({route.candidate_trips.length})</h4>
                      {route.candidate_trips.map((trip: any) => (
                        <div key={trip.trip_id} className={styles.candidateTrip}>
                          {trip.trip_id_short} - {trip.trip_status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h3>Place Bet</h3>
      {!isBettingOpen && (
        <div className={styles.warning}>
          Betting is {bettingStatus.toLowerCase()}. You cannot place bets at this time.
        </div>
      )}
      <form onSubmit={handlePlaceBet} className={styles.form}>
        {betError && <div className={styles.error}>{betError}</div>}
        {betSuccess && <div className={styles.success}>{betSuccess}</div>}
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          required
          disabled={!isBettingOpen}
        >
          <option value="">Select a route</option>
          {routes.map((route: any) => (
            <option key={route.route_id} value={route.route_id}>
              Route {route.route_id} - {route.route_status}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Bet amount"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          min="1"
          required
          disabled={!isBettingOpen}
        />
        <button type="submit" disabled={betting || !isBettingOpen}>
          {betting ? 'Placing bet...' : 'Place Bet'}
        </button>
      </form>
    </div>
  );
}
