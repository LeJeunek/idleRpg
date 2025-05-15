// src/utils.js

// Import your enemy images
import goblinImage from "./goblin.png"; // Assuming 'assets' is a folder next to utils.js
import skeletonImage from "./skel.png"; // Adjust paths as needed
import orcImage from "./orc.png"; // Adjust paths as needed

export function getRandomEnemy() {
  const enemies = [
    {
      name: "Goblin",
      hp: 30,
      attack: 5,
      defense: 2,
      xp: 20,
      image: goblinImage,
    },
    {
      name: "Skeleton",
      hp: 40,
      attack: 6,
      defense: 3,
      xp: 25,
      image: skeletonImage,
    },
    { name: "Orc", hp: 50, attack: 8, defense: 4, xp: 40, image: orcImage },
  ];
  return enemies[Math.floor(Math.random() * enemies.length)];
}

export function getUpgradeOptions() {
  const upgrades = [
    { stat: "attack", amount: 5, label: "+5 Attack" },
    { stat: "defense", amount: 5, label: "+3 Defense" },
    { stat: "hp", amount: 5, label: "+20 HP" },
  ];
  const shuffle = upgrades.sort(() => 0.5 * Math.random());
  const shuffled = shuffle.slice(0, 3);
  return shuffled;
}
