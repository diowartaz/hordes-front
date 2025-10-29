## 🧾 Summary

| Category | Value |
|-----------|--------|
| Game Name | **Hordes** |
| Genre | **Single-player survival (asynchronous ranked)** |
| Front-end | **Angular 19** |
| Back-end | **Node.js + Express** |
| Database | **MongoDB** |
| Target Distribution | **Android (Google Play / APK)** |


# 🧟 HORDES — Official Game Wiki

## Overview
**Hordes** is a single-player survival strategy game where you are the last human alive in a ruined city.  
Each night, waves of zombies attack your defenses. Each day, you scavenge, build, and learn in an effort to survive one more night.  

How long can you last before the horde overwhelms you?

---

## ⚙️ Game Systems

### 🕐 The Daily Cycle
Each game day is divided into two main phases:

1. **Daytime**  
   You have limited time before midnight. You can:
   - **Search for resources** — Find materials needed for building.
   - **Build defenses** — Spend time and resources to construct or upgrade buildings.
   - **Learn skills** — Spend time to improve your abilities and reduce future action times.

   Every action consumes **time**. Managing it wisely is the key to survival.

2. **Nighttime (Midnight Attack)**  
   - A horde of zombies attacks your city.  
   - If the **number of zombies** exceeds your **total defense**, you die.  
   - If you survive, you gain **experience (XP)** and possibly discover new **building plans** or **skill levels** depending on your structures.

Then the next day begins — with more zombies on the way.

---

## 🧱 Buildings

Buildings cost **resources** and **time** to construct.  
Most buildings increase your **defense**, helping you survive longer.  

However, two special buildings provide **strategic advantages** rather than defense:

| Building | Max Level | Description |
|-----------|------------|-------------|
| 🏗 **Architect Shelter** | 3 | Increases your odds of discovering **new building plans** during the night. Higher levels give more options for future builds. |
| 📚 **Library** | 3 | Increases your odds of discovering **new skill levels**. For example, it might expand a skill’s maximum level cap. |

Each city starts with a limited number of **building plans**, randomly chosen at the start of a new game.

---

### 🏙 Starting Setup

At the beginning, your city will have access to **7 different building blueprints**, and **all skills start at level 0**.  
However, the **total of all skills’ maximum levels available at the start is 9**.  
For example, you might initially be able to train **Digger up to level 3**, **Builder up to level 2**, **Insomniac up to level 4**, and **Fast Learner up to level 0**.  
To unlock higher maximum levels for your skills, you must construct and upgrade your **Library**, which increases your chances of discovering new skill tiers.

---

## 🧠 Skills

Skills help you optimize your daily efficiency. Each level improves a specific aspect of your survival.  
Skill improvements are **linear per level**, and all skills have a **maximum level**.

| Skill | Max Level | Effect per Level | Level 5 / 8 Effect |
|--------|------------|------------------|--------------------|
| 💤 **Insomniac** | 8 | Wake up 15 minutes earlier each day. | 2 hours earlier wake-up at level 8. |
| ⛏ **Digger** | 5 | Reduce search/dig time linearly. | Action time divided by 2 at level 5. |
| 🧱 **Builder** | 5 | Reduce building time linearly. | Action time divided by 2 at level 5. |
| 📖 **Fast Learner** | 5 | Reduce learning time linearly. | Learning time divided by 2 at level 5. |

Skill level caps can be increased by upgrading your **Library**.

---

## ⚔️ Defense and Attacks

- Every building (except Architect Shelter and Library) adds **defense points**.  
- Each night, the **zombie horde** increases in number.  
- If your **total defense** ≥ **zombie count**, you survive.  
- Otherwise, you die and your run ends.

Defense points are cumulative — build strategically to stay ahead of the horde’s growth.

---

## 💡 Experience & Levels

After each successful night, you gain **XP** equal to the number of zombies defeated that night.

> **Example:**  
> If your city had 100 defense and 82 zombies attacked, you earn **82 XP**.

Your **player level** is derived from your total XP using a **logarithmic curve**, meaning:
- Levels become progressively harder to gain.  
- Early levels come quickly, but higher levels require exponentially more XP.

Each **player level** grants a **+1 minute earlier wake-up bonus** every day.

> Example: Level 14 → Wake up 14 minutes earlier than normal.

This bonus stacks with the **Insomniac skill**, making XP and level progression highly valuable in long survival runs.

---

## 🧮 Ranked Mode

Ranked mode allows you to **compete asynchronously** with other players using deterministic runs.

### How It Works
1. When you start a **ranked game**, the server assigns a **unique seed**.  
2. All random events (resources, discoveries, zombie waves) are based on that seed.  
3. Any other player who starts the same ranked seed will face **exactly the same challenges**.  
4. Both players play independently.  
5. Once both runs end, their performances are compared.

### Scoring & Ranking
- Performance is evaluated by:
  - **Days survived**
  - **Total defenses built**
- The winner gains **ranked points**, calculated using an **Elo-like system**.  
- Players can view:
  - **Global Leaderboard (Ranked Points)**
  - **Performance Leaderboard (Best Survival Run)**

### Rules
- You can play multiple ranked games at once (asynchronous).
- Dying in one ranked run doesn’t prevent you from starting another.
- Determinism ensures that ranked runs are purely **skill-based** — no luck advantage.

---

## 📈 Example Progression

| Day | Zombies | Defense | Result | XP Earned |
|------|----------|----------|---------|------------|
| 1 | 10 | 15 | Survive | 10 XP |
| 2 | 20 | 23 | Survive | 20 XP |
| 3 | 35 | 28 | Die | — |

→ Total XP: **30**  
→ Approx. Level: **logarithmic scaling → Level 4**  
→ Next run starts with improved wake-up time and refined strategy.

---

## 🧩 Strategy Tips
- **Use Libraries smartly:** Unlock higher skill caps to surpass your early efficiency limits.  
- **Architect Shelters** are essential for long runs — more blueprints mean more defense variety.  
- In **Ranked Mode**, focus on **efficiency**, not just survival — time management and planning beat luck every time.

---

## 🧱 Coming Soon (Planned / In Progress)
- Android release via Play Store (in progress — converting Angular build to downloadable app).  

---

## 📜 Summary

| Category | Value |
|-----------|--------|
| Game Type | Single-player survival |
| Ranked Mode | Asynchronous, seed-based |
| Tech Stack | Angular 19 / Node.js / Express / MongoDB |
| Starting Buildings | 7 |
| Starting Skill Level Caps (Total) | 9 |
| Special Buildings | Architect Shelter, Library |
| Skill Scaling | Linear |
| XP → Level | Logarithmic |
| Level Bonus | +1 min earlier wake-up per level |
| Platforms | Web, Android (planned) |

---
