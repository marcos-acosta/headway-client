'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import styles from './Auth.module.css';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await api.login(username, password);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        localStorage.setItem('session_token', result.data.session_token);
        localStorage.setItem('username', result.data.username);
        onLogin();
      }
    } else {
      const result = await api.register(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        const loginResult = await api.login(username, password);
        if (loginResult.data) {
          localStorage.setItem('session_token', loginResult.data.session_token);
          localStorage.setItem('username', loginResult.data.username);
          onLogin();
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account?' : 'Have an account?'}
        </button>
      </form>
    </div>
  );
}
