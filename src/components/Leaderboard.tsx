'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { LeaderboardEntry } from '@/types/game';
import styles from './Leaderboard.module.css';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    const result = await api.getLeaderboard(100);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setLeaderboard(result.data.leaderboard);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Leaderboard</h2>
      <div className={styles.list}>
        {leaderboard.map((entry) => (
          <div key={entry.user_id} className={styles.entry}>
            <div className={styles.rank}>{entry.rank}</div>
            <div className={styles.username}>{entry.username}</div>
            <div className={styles.tokens}>{entry.num_tokens} tokens</div>
          </div>
        ))}
      </div>
    </div>
  );
}
