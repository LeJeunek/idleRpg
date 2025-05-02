import React, { useState, useEffect } from "react";
import "./styles.css";
import { getRandomEnemy, getUpgradeOptions } from "./utils";

const BASE_PLAYER = {
  hp: 100,
  attack: 10,
  defense: 5,
  level: 1,
  xp: 0,
};

export default function App() {
  const [player, setPlayer] = useState(BASE_PLAYER);
  const [enemy, setEnemy] = useState(getRandomEnemy());
  const [log, setLog] = useState([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      battle();
    }, 2000);
    return () => clearInterval(interval);
  }, [player]);

  const battle = () => {
    const playerDmg = Math.max(player.attack - enemy.defense, 1);
    const enemyDmg = Math.max(enemy.attack - player.defense, 0);

    const logEntry = `You hit ${enemy.name} for ${playerDmg} dmg.`;

    if (enemy.hp - playerDmg <= 0) {
      const xpGain = enemy.xp;
      const newXp = player.xp + xpGain;
      const nextLevel = Math.floor(newXp / 100) + 1;

      setLog((prev) => [`Defeated ${enemy.name}. +${xpGain} XP`, ...prev]);
      setPlayer((prev) => ({
        ...prev,
        xp: newXp,
        level: nextLevel,
        hp: prev.hp,
      }));

      if (nextLevel > player.level) {
        setShowUpgrade(true);
        setUpgradeOptions(getUpgradeOptions());
      }

      setEnemy(getRandomEnemy());
    } else {
      setEnemy((prev) => ({ ...prev, hp: prev.hp - playerDmg }));
      setPlayer((prev) => ({
        ...prev,
        hp: Math.max(prev.hp - enemyDmg, 0),
      }));
      setLog((prev) => [logEntry, ...prev]);
    }
  };

  const handleUpgrade = (upgrade) => {
    setPlayer((prev) => ({
      ...prev,
      [upgrade.stat]: prev[upgrade.stat] + upgrade.amount,
    }));
    setShowUpgrade(false);
  };

  return (
    <div className="App">
      <h1>Idle RPG</h1>
      <div className="stats">
        <div>
          <h2>🧙 Player</h2>
          <p>HP: {player.hp}</p>
          <p>Attack: {player.attack}</p>
          <p>Defense: {player.defense}</p>
          <p>Level: {player.level}</p>
          <p>XP: {player.xp}</p>
        </div>
        <div>
          <h2>👾 Enemy: {enemy.name}</h2>
          <p>HP: {enemy.hp}</p>
          <p>Attack: {enemy.attack}</p>
          <p>Defense: {enemy.defense}</p>
        </div>
        <h3>📜 Battle Log</h3>
        <ul>
          {log.slice(0, 5).map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>

        {showUpgrade && (
          <div className="modal">
            <h2>Level Up! Choose your Upgrade!</h2>
            {upgradeOptions.map((opt, i) => (
              <button key={i} onClick={() => handleUpgrade(opt)}>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
