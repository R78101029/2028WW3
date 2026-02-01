# Renumbering Plan

The goal is to eliminate fractional numbering (e.g., 01-B, 03-B) and use a clean, sequential integer format for all chapters.

## Mapping

| Old Filename | New Filename | Title |
|--------------|--------------|-------|
| `Chap_00_Prologue_The_Tinderbox.md` | `Chap_00_Prologue_The_Tinderbox.md` | Prologue |
| `Chap_01-B_Europe_The_Chessboard.md` | `Chap_01_Europe_The_Chessboard.md` | Chapter 1 |
| `Chap_01_Interlude_I_Silence_From_Above.md` | `Chap_02_Interlude_I_Silence_From_Above.md` | Chapter 2 |
| `Chap_02_Asia_The_Blinding.md` | `Chap_03_Asia_The_Blinding.md` | Chapter 3 |
| `Chap_03_Asia_The_Ant_Colony.md` | `Chap_04_Asia_The_Ant_Colony.md` | Chapter 4 |
| `Chap_03-B_Asia_Twenty_Years.md` | `Chap_05_Asia_Twenty_Years.md` | Chapter 5 |
| `Chap_04_Europe_The_Suwałki_Deception.md` | `Chap_06_Europe_The_Suwałki_Deception.md` | Chapter 6 |
| `Chap_05_Interlude_Pentagon_Vacuum.md` | `Chap_07_Interlude_Pentagon_Vacuum.md` | Chapter 7 |
| `Chap_06_Asia_The_Wave.md` | `Chap_08_Asia_The_Wave.md` | Chapter 8 |
| `Chap_07_Asia_Tokyo_Choice.md` | `Chap_09_Asia_Tokyo_Choice.md` | Chapter 9 |
| `Chap_08_MiddleEast_The_Package.md` | `Chap_10_MiddleEast_The_Package.md` | Chapter 10 |
| `Chap_09_Asia_Implosion.md` | `Chap_11_Asia_Implosion.md` | Chapter 11 |
| `Chap_10_Interlude_II_The_Chameleon.md` | `Chap_12_Interlude_II_The_Chameleon.md` | Chapter 12 |
| `Chap_10-B_Asia_Island_Diary.md` | `Chap_13_Asia_Island_Diary.md` | Chapter 13 |
| `Chap_11_Asia_First_Blood.md` | `Chap_14_Asia_First_Blood.md` | Chapter 14 |
| `Chap_12_Europe_The_Last_Train.md` | `Chap_15_Europe_The_Last_Train.md` | Chapter 15 |
| `Chap_12-B_Europe_The_Other_Side.md` | `Chap_16_Europe_The_Other_Side.md` | Chapter 16 |
| `Chap_13_Asia_Black_Fog.md` | `Chap_17_Asia_Black_Fog.md` | Chapter 17 |
| `Chap_14_MiddleEast_Glass_Maze.md` | `Chap_18_MiddleEast_Glass_Maze.md` | Chapter 18 |
| `Chap_15_Global_Silent_Fleet.md` | `Chap_19_Global_Silent_Fleet.md` | Chapter 19 |
| `Chap_16_Interlude_III_Dragons_Eye.md` | `Chap_20_Interlude_III_Dragons_Eye.md` | Chapter 20 |
| `Chap_16-B_Asia_The_Teacher.md` | `Chap_21_Asia_The_Teacher.md` | Chapter 21 |
| `Chap_17_Europe_Hunter_Hunted.md` | `Chap_22_Europe_Hunter_Hunted.md` | Chapter 22 |
| `Chap_18_Asia_Island_Frequency.md` | `Chap_23_Asia_Island_Frequency.md` | Chapter 23 |
| `Chap_18-B_Global_Pine_Gap_Heartbeat.md` | `Chap_24_Global_Pine_Gap_Heartbeat.md` | Chapter 24 |
| `Chap_19_Global_Blood_Trail.md` | `Chap_25_Global_Blood_Trail.md` | Chapter 25 |
| `Chap_20_Global_The_Cipher.md` | `Chap_26_Global_The_Cipher.md` | Chapter 26 |
| `Chap_21_Global_Night_of_Long_Knives.md` | `Chap_27_Global_Night_of_Long_Knives.md` | Chapter 27 |
| `Chap_22_Global_The_Pincer.md` | `Chap_28_Global_The_Pincer.md` | Chapter 28 |
| `Chap_22-B_Asia_The_Distraction.md` | `Chap_29_Asia_The_Distraction.md` | Chapter 29 |
| `Chap_23_Asia_Scorched_Earth.md` | `Chap_30_Asia_Scorched_Earth.md` | Chapter 30 |
| `Chap_24_Global_Link_Restored.md` | `Chap_31_Global_Link_Restored.md` | Chapter 31 |
| `Chap_24-B_Global_The_Witness.md` | `Chap_32_Global_The_Witness.md` | Chapter 32 |
| `Chap_25_Global_The_Verdict.md` | `Chap_33_Global_The_Verdict.md` | Chapter 33 |
| `Chap_26_Global_Brave_New_World.md` | `Chap_34_Global_Brave_New_World.md` | Chapter 34 |

## Actions
1. Execute file renames in PowerShell.
2. Update `chapter_order.md` to reflect new numbering.
3. Update internal links in markdown files (unlikely, but check).
