"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Game } from "@/types/game";
import styles from "./GamesList.module.css";

interface GamesListProps {
  onSelectGame: (gameId: string) => void;
}

export default function GamesList({ onSelectGame }: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    const result = await api.getGames({ limit: 50, order: "desc" });
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGames(result.data.games);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error}</div>;

  // Group games by week number
  const gamesByWeek = games.reduce((acc, game) => {
    const week = game.week_number;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(game);
    return acc;
  }, {} as Record<number, Game[]>);

  // Sort week numbers in descending order
  const sortedWeeks = Object.keys(gamesByWeek)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className={styles.container}>
      <h2>Games</h2>
      {sortedWeeks.map((weekNumber) => (
        <div key={weekNumber} className={styles.weekGroup}>
          <h3 className={styles.weekHeader}>Week {weekNumber}</h3>
          <div className={styles.list}>
            {gamesByWeek[weekNumber].map((game) => (
              <div
                key={game.game_id}
                className={styles.game}
                onClick={() => onSelectGame(game.game_id)}
              >
                <div>Game {game.game_id}</div>
                <div>Date: {game.date}</div>
                <div>Type: {game.game_type}</div>
                <div>Status: {game.game_status}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
