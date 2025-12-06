'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User, Bet, Transaction } from '@/types/game';
import styles from './UserProfile.module.css';

interface UserProfileProps {
  onBalanceUpdate: () => void;
}

export default function UserProfile({ onBalanceUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rebuyLoading, setRebuyLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const [userResult, betsResult, transactionsResult] = await Promise.all([
      api.getCurrentUser(),
      api.getUserBets({ limit: 20, order: 'desc' }),
      api.getUserTransactions({ limit: 20, order: 'desc' }),
    ]);

    if (userResult.error) {
      setError(userResult.error);
    } else if (userResult.data) {
      setUser(userResult.data);
    }

    if (betsResult.data) {
      setBets(betsResult.data.bets);
    }

    if (transactionsResult.data) {
      setTransactions(transactionsResult.data.transactions);
    }

    setLoading(false);
  };

  const handleRebuy = async () => {
    setRebuyLoading(true);
    const result = await api.rebuy();
    if (result.error) {
      alert(result.error);
    } else {
      onBalanceUpdate();
      loadUserData();
    }
    setRebuyLoading(false);
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className={styles.container}>
      <h2>Profile</h2>
      <div>Username: {user.username}</div>
      <div>Tokens: {user.num_tokens}</div>
      <div>Rebuys: {user.num_rebuys}</div>
      <button onClick={handleRebuy} disabled={rebuyLoading}>
        {rebuyLoading ? 'Processing...' : 'Rebuy 1000 tokens'}
      </button>

      <h3>Recent Bets</h3>
      <div className={styles.list}>
        {bets.map((bet, i) => (
          <div key={i} className={styles.item}>
            <div>Game: {bet.game_id}</div>
            <div>Route: {bet.route_id}</div>
            <div>Amount: {bet.amount}</div>
            <div>Payout: {bet.payout || 'Pending'}</div>
            <div>Placed: {bet.created_at}</div>
          </div>
        ))}
      </div>

      <h3>Recent Transactions</h3>
      <div className={styles.list}>
        {transactions.map((txn, i) => (
          <div key={i} className={styles.item}>
            <div>Type: {txn.transaction_type}</div>
            <div>Amount: {txn.amount}</div>
            <div>Date: {txn.created_at}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
