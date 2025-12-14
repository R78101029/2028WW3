import os

base_path = r"h:\Google Drive\CQI365Obsidian\19_🎨Novel\BlindOrbit_novel2028\03_Story"
output_file = r"h:\Google Drive\CQI365Obsidian\19_🎨Novel\BlindOrbit_novel2028\05_Archives\Draft_Complete_v1.md"

files = [
    "00_Interlude_I_Silence_From_Above.md",
    "01_Asia_The_Blinding.md",
    "02_Europe_The_Suwałki_Deception.md",
    "03_Asia_The_Wave.md",
    "04_MiddleEast_The_Package.md",
    "05_Interlude_II_The_Chameleon.md",
    "05_Asia_Static_and_Hearts.md",
    "06_Europe_The_Last_Train.md",
    "07_MiddleEast_Glass_Maze.md",
    "08_Global_Silent_Fleet.md",
    "09_Interlude_III_Dragons_Eye.md",
    "10_Europe_Hunter_Hunted.md",
    "11_Asia_Island_Frequency.md",
    "12_Global_Blood_Trail.md",
    "13_Global_Night_of_Long_Knives.md",
    "14_Global_The_Pincer.md",
    "15_Asia_Scorched_Earth.md",
    "16_Global_Link_Restored.md",
    "17_Global_Brave_New_World.md"
]

try:
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write("# 2028 WW3: The Silent War\n\n")
        outfile.write("## Draft Version 1.0\n")
        outfile.write("**Masterpiece Edition**\n\n")
        outfile.write("---\n\n")
        
        for filename in files:
            filepath = os.path.join(base_path, filename)
            if os.path.exists(filepath):
                print(f"Adding {filename}...")
                with open(filepath, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    outfile.write(content)
                    outfile.write("\n\n---\n\n") # Separator
            else:
                print(f"Warning: {filename} not found.")
                outfile.write(f"\n\n> [MISSING FILE: {filename}]\n\n")

    print(f"Successfully compiled manuscript to {output_file}")

except Exception as e:
    print(f"Error: {e}")
