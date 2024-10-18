import os
import re
from datetime import timedelta
import mod_scrub_content  # Ensure this module is accessible

# --------------------- Helper Function Definitions ---------------------


def time_str_to_seconds(time_str):
    """
    Converts a time string in the format [-]HH:MM:SS to total seconds.

    Parameters:
        time_str (str): Time string to convert (e.g., "-35:17:25" or "00:00:10").

    Returns:
        int: Total seconds represented by the time string.
             Negative if the time string starts with '-'.
             Returns 0 if the format is invalid.
    """
    negative = False
    if time_str.startswith("-"):
        negative = True
        time_str = time_str[1:]
    try:
        parts = time_str.split(":")
        if len(parts) != 3:
            raise ValueError(f"Invalid time format: {time_str}")
        hours, minutes, seconds = map(int, parts)
        total_seconds = hours * 3600 + minutes * 60 + seconds
        return -total_seconds if negative else total_seconds
    except Exception as e:
        print(f"Error converting time string '{time_str}' to seconds: {e}")
        return 0


def seconds_to_time_str(seconds):
    """
    Converts total seconds to a time string in the format [-]HH:MM:SS.

    Parameters:
        seconds (int): Total seconds to convert.

    Returns:
        str: Formatted time string with '-' prefix if negative.
    """
    negative = False
    if seconds < 0:
        negative = True
        seconds = abs(seconds)
    hours, remainder = divmod(seconds, 3600)
    minutes, secs = divmod(remainder, 60)
    time_str = f"{int(hours):02}:{int(minutes):02}:{int(secs):02}"
    return f"-{time_str}" if negative else time_str


def seconds_to_timeid(seconds):
    negative = False
    if seconds < 0:
        negative = True
        seconds = abs(seconds)
    hours, remainder = divmod(seconds, 3600)
    minutes, secs = divmod(remainder, 60)
    time_str = f"{int(hours):02}{int(minutes):02}{int(secs):02}"
    return f"-{time_str}" if negative else time_str


def sort_utterances(utterances):
    """
    Sorts a list of tuples based on the first element (time in seconds).

    Parameters:
        utterances (list of tuples): Each tuple contains time in seconds and utterance.

    Returns:
        list of tuples: Sorted list of utterances.
    """
    return sorted(utterances, key=lambda x: x[0])


# --------------------- End of Helper Function Definitions ---------------------

# Define paths
INPUT_DIR = "F:/A13_whisperx_MOCR_transcription"
OUTPUT_DIR = os.path.join(INPUT_DIR, ".channel_transcripts")

# Regular expression to find channel designation (e.g., CH10) in filename
CHANNEL_REGEX = re.compile(r"(CH\d+)", re.IGNORECASE)

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Initialize data structures
channel_utterances = {}  # Dictionary to store utterances per channel

# Traverse each tape subdirectory in INPUT_DIR
for tape_folder in os.listdir(INPUT_DIR):
    tape_path = os.path.join(INPUT_DIR, tape_folder)
    if not os.path.isdir(tape_path):
        continue  # Skip files, process directories only

    # **Filter: Only process folders starting with "DA13"**
    if not tape_folder.startswith("DA13"):
        continue

    # Iterate through each .txt file in the tape folder
    for filename in os.listdir(tape_path):
        if not filename.endswith(".txt"):
            continue  # Skip non-.txt files

        # **Simplify Channel Extraction: Directly find "CH10" or similar in filename**
        match = CHANNEL_REGEX.search(filename)
        if not match:
            print(
                f"Could not find channel designation in filename '{filename}'. Skipping."
            )
            continue
        channel_designation = match.group(1).upper()  # e.g., 'CH12'

        # **Extract Tape Type from Filename**
        # Assuming the filename format is: DA13_T708_HR1L_CH12_whisperx_aligned_transcript.txt
        # Split by underscores and get the third part (index 2) for tape type
        parts = filename.split("_")
        if len(parts) < 4:
            print(
                f"Filename '{filename}' does not have enough parts to extract tape type. Skipping."
            )
            continue
        tape_type = parts[2].upper()  # e.g., 'HR1L', 'HR2U'

        # **Adjust Channel Number if Tape Type starts with "HR2"**
        if tape_type.startswith("HR2"):
            # Extract numerical part of the channel
            channel_num_match = re.match(r"CH(\d+)", channel_designation)
            if channel_num_match:
                original_channel_num = int(channel_num_match.group(1))
                adjusted_channel_num = original_channel_num + 30
                channel_designation = f"CH{adjusted_channel_num}"
                # print(
                #     f"Adjusted channel number for tape type '{tape_type}': CH{original_channel_num} -> {channel_designation}"
                # )
            else:
                print(
                    f"Invalid channel format '{channel_designation}' in filename '{filename}'. Skipping adjustment."
                )

        # Initialize channel in dictionary if not already present
        if channel_designation not in channel_utterances:
            channel_utterances[channel_designation] = []

        # Full path to the .txt file
        txt_path = os.path.join(tape_path, filename)

        # Read and parse the .txt file
        try:
            with open(txt_path, "r", encoding="utf-8") as file:
                for line_num, line in enumerate(file, 1):
                    line = line.strip()
                    if not line:
                        continue  # Skip empty lines
                    try:
                        time_str, utterance = line.split("|", 1)
                        total_seconds = time_str_to_seconds(time_str)
                        scrubbed_utterance = mod_scrub_content.scrub_content(utterance)
                        if utterance and not scrubbed_utterance.get(
                            "skip"
                        ):  # Ensure utterance is not empty and not skipped
                            # Append to channel-specific list
                            channel_utterances[channel_designation].append(
                                (
                                    total_seconds,
                                    scrubbed_utterance.get("content", "").strip(),
                                )
                            )
                    except ValueError:
                        print(
                            f"Invalid line format in file '{filename}' at line {line_num}: {line}"
                        )
                        continue
        except Exception as e:
            print(f"Error reading file '{txt_path}': {e}")
            continue

        print(f"Processed file: {filename}")

# After collecting all data, sort and write to output files

# Write channel-specific transcript files
for channel, utterances in channel_utterances.items():
    sorted_utterances = sort_utterances(utterances)
    channel_filename = f"{channel}_transcript.txt"
    channel_filepath = os.path.join(OUTPUT_DIR, channel_filename)
    try:
        with open(channel_filepath, "w", encoding="utf-8") as channel_file:
            for time_sec, utterance in sorted_utterances:
                time_formatted = seconds_to_timeid(time_sec)
                channel_file.write(f"{time_formatted}|{utterance}\n")
        print(f"Written channel transcript: {channel_filename}")
    except Exception as e:
        print(f"Error writing channel file '{channel_filename}': {e}")

# Assemble all utterances by iterating through channel_utterances
all_utterances = []
for channel, utterances in channel_utterances.items():
    for time_sec, utterance in utterances:
        all_utterances.append((time_sec, channel, utterance))

# Sort all utterances across channels
sorted_all_utterances = sort_utterances(all_utterances)

# Write the consolidated all_channels.txt file
all_channels_filepath = os.path.join(OUTPUT_DIR, "A13_all_channels.txt")
try:
    with open(all_channels_filepath, "w", encoding="utf-8") as all_file:
        for time_sec, channel, utterance in sorted_all_utterances:
            time_formatted = seconds_to_timeid(time_sec)
            all_file.write(f"{time_formatted}|{channel}|{utterance}\n")
    print(f"Written consolidated transcript: A13_all_channels.txt")
except Exception as e:
    print(f"Error writing consolidated transcript 'A13_all_channels.txt': {e}")

print("All channel transcripts have been successfully created.")
