'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import styles from './GamesList.module.css';

interface GamesListProps {
  onSelectGame: (gameId: string) => void;
}

export default function GamesList({ onSelectGame }: GamesListProps) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    const result = await api.getGames({ limit: 50, order: 'desc' });
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGames(result.data.games);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Games</h2>
      <div className={styles.list}>
        {games.map((game) => (
          <div key={game.game_id} className={styles.game} onClick={() => onSelectGame(game.game_id)}>
            <div>Game {game.game_id}</div>
            <div>Date: {game.date}</div>
            <div>Week: {game.week_number}</div>
            <div>Type: {game.game_type}</div>
            <div>Status: {game.game_status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
