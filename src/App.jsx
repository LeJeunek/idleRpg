import React, { useState, useEffect } from "react";
import "./styles.css";
import { getRandomEnemy, getUpgradeOptions } from "./utils";

import mageImage from "./wiz.png"; // Adjust path as needed
import archerImage from "./arch.png"; // Adjust path as needed
import warriorImage from "./war.png"; // Adjust path as needed

const BASE_PLAYER = {
  hp: 100,
  attack: 10,
  defense: 5,
  level: 1,
  xp: 0,
  class: null, // Add a class property
};
const CLASSES = {
  Mage: {
    hp: 80,
    attack: 15,
    defense: 3,
    image: mageImage,
  },
  Archer: {
    hp: 90,
    attack: 12,
    defense: 4,
    image: archerImage,
  },
  Warrior: {
    hp: 120,
    attack: 8,
    defense: 7,
    image: warriorImage,
  },
};
export default function App() {
  const [player, setPlayer] = useState(BASE_PLAYER);
  const [enemy, setEnemy] = useState(null); // Start with no enemy until class is chosen
  const [log, setLog] = useState([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState([]);
  const [showClassSelection, setShowClassSelection] = useState(true); // Corrected state name and initial value

  useEffect(() => {
    // Only start the battle interval if a class has been chosen
    if (player.class) {
      const interval = setInterval(() => {
        battle();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [player.class, player]); // Add player.class to the dependency array

  const battle = () => {
    if (!enemy) return; // Don't battle if there's no enemy

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
        hp: prev.hp, // Keep current HP on level up
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

  const handleClassSelect = (className) => {
    const selectedClass = CLASSES[className];
    setPlayer((prev) => ({
      ...prev,
      ...selectedClass,
      class: className,
    }));
    setShowClassSelection(false); // Hide class selection after choosing
    setEnemy(getRandomEnemy()); // Start spawning enemies
  };

  // ... (previous imports and state)

  return (
    <div className="App">
      <h1>Idle RPG</h1>

      {showClassSelection ? (
        <div className="class-selection">
          <h2 className="class-select-title">Choose Your Class</h2>{" "}
          {/* Added class-select-title */}
          <div className="class-options">
            {" "}
            {/* Consider adding styles for .class-options */}
            {Object.keys(CLASSES).map((className) => (
              <div
                key={className}
                className="class-option"
                onClick={() => handleClassSelect(className)}
              >
                <img
                  src={CLASSES[className].image}
                  alt={className}
                  className="classes"
                />{" "}
                {/* Added classes */}
                <p className="class-name">{className}</p>{" "}
                {/* Added class-name */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // If showClassSelection is false, render the main game content within a fragment
        <>
          <div className="stats">
            <div>
              <h2>
                {player.class}
                {player.class && (
                  <img
                    src={CLASSES[player.class].image}
                    alt={player.class}
                    style={{
                      width: "75px",
                      height: "75px",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </h2>
              <p>HP: {player.hp}</p>
              <p>Attack: {player.attack}</p>
              <p>Defense: {player.defense}</p>
              <p>Level: {player.level}</p>
              <p>XP: {player.xp}</p>
            </div>
            {enemy && ( // Only show enemy stats if an enemy exists
              <div>
                <h2>
                  {enemy.name}
                  <img // Add enemy image here
                    src={enemy.image}
                    alt={enemy.name}
                    style={{
                      width: "75px", // Adjust size as needed
                      height: "75px", // Adjust size as needed
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  />
                </h2>
                <p>HP: {enemy.hp}</p>
                <p>Attack: {enemy.attack}</p>
                <p>Defense: {enemy.defense}</p>
              </div>
            )}
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
        </>
      )}
    </div>
  );
}
