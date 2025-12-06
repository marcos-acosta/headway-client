'use client';

import { useState, useEffect } from 'react';
import Auth from '@/components/Auth';
import GamesList from '@/components/GamesList';
import GameDetail from '@/components/GameDetail';
import UserProfile from '@/components/UserProfile';
import Leaderboard from '@/components/Leaderboard';
import styles from './page.module.css';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'games' | 'game-detail' | 'profile' | 'leaderboard'>('games');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setCurrentView('games');
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentView('game-detail');
  };

  const handleBackToGames = () => {
    setCurrentView('games');
    setSelectedGameId(null);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <button onClick={() => setCurrentView('games')}>Games</button>
        <button onClick={() => setCurrentView('profile')}>Profile</button>
        <button onClick={() => setCurrentView('leaderboard')}>Leaderboard</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main className={styles.main}>
        {currentView === 'games' && <GamesList onSelectGame={handleSelectGame} key={refreshKey} />}
        {currentView === 'game-detail' && selectedGameId && (
          <GameDetail gameId={selectedGameId} onBack={handleBackToGames} onBetPlaced={handleRefresh} />
        )}
        {currentView === 'profile' && <UserProfile onBalanceUpdate={handleRefresh} key={refreshKey} />}
        {currentView === 'leaderboard' && <Leaderboard key={refreshKey} />}
      </main>
    </div>
  );
}
