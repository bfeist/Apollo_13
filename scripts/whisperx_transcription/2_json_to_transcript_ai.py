import os
import json
import csv
from datetime import timedelta
import mod_scrub_content  # Ensure this module is accessible

# Define paths
CSV_PATH = "D:/Apollo_13/_website/_webroot/13/MOCRviz/data/tape_ranges.csv"
INPUT_DIR = "F:/A13_whisperx_MOCR_transcription"  # Both input and output
OUTPUT_DIR = "F:/A13_whisperx_MOCR_transcription"  # Both input and output


# Helper function to convert time string to timedelta
def time_str_to_timedelta(time_str):
    """
    Converts a time string in the format [-]HH:MM:SS to a timedelta object.
    """
    negative = False
    if time_str.startswith("-"):
        negative = True
        time_str = time_str[1:]
    parts = time_str.split(":")
    if len(parts) != 3:
        raise ValueError(f"Invalid time format: {time_str}")
    hours, minutes, seconds = map(int, parts)
    td = timedelta(hours=hours, minutes=minutes, seconds=seconds)
    return -td if negative else td


# Helper function to format timedelta to HH:MM:SS with optional negative sign
def format_timedelta(td):
    """
    Formats a timedelta object to a string in HH:MM:SS format, prefixing with '-' if negative.
    """
    total_seconds = int(td.total_seconds())
    negative = total_seconds < 0
    total_seconds = abs(total_seconds)
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    time_str = f"{hours:02}:{minutes:02}:{seconds:02}"
    return f"-{time_str}" if negative else time_str


# Load tape ranges from CSV
tape_ranges = {}
with open(CSV_PATH, "r", encoding="utf-8") as csvfile:
    reader = csv.reader(csvfile, delimiter="|")
    for row in reader:
        if len(row) != 4:
            print(f"Skipping invalid row: {row}")
            continue
        tape_number, tape_type, start_time_str, end_time_str = row
        key = (tape_number.strip(), tape_type.strip())
        try:
            start_td = time_str_to_timedelta(start_time_str.strip())
            end_td = time_str_to_timedelta(end_time_str.strip())
            tape_ranges[key] = (start_td, end_td)
        except ValueError as ve:
            print(f"Error parsing times for {key}: {ve}")
            continue

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Traverse each subdirectory (tape) in INPUT_DIR
for tape_folder in os.listdir(INPUT_DIR):
    tape_path = os.path.join(INPUT_DIR, tape_folder)
    if not os.path.isdir(tape_path):
        continue  # Skip files, process directories only
    if not tape_folder.startswith("DA13"):
        continue

    # Process each JSON file within the tape folder
    for filename in os.listdir(tape_path):
        if not filename.endswith(".json"):
            continue  # Skip non-JSON files

        # Full path to JSON file
        json_path = os.path.join(tape_path, filename)

        # Parse filename
        # Expected format: DA13_T708_HR1L_CH12_whisperx_aligned_transcript.json
        parts = filename.rstrip(".json").split("_")
        if len(parts) < 4:
            print(f"Filename {filename} does not match expected format. Skipping.")
            continue

        tape_number = parts[1]  # e.g., T708
        tape_type = parts[2]  # e.g., HR1L
        channel = parts[3]  # e.g., CH12

        key = (tape_number, tape_type)
        if key not in tape_ranges:
            print(f"No tape range found for {key} in {filename}. Skipping.")
            continue

        tape_start_td, tape_end_td = tape_ranges[key]

        # Load JSON content
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error reading {json_path}: {e}")
            continue

        # Prepare output file path
        # Replace .json with .txt in the same directory
        output_filename = filename.rstrip(".json") + ".txt"
        output_path = os.path.join(tape_path, output_filename)

        with open(output_path, "w", encoding="utf-8") as outfile:
            # Process each segment
            for segment in data.get("segments", []):
                try:
                    # Extract segment start time and text
                    relative_start_sec = float(segment.get("start", 0))
                    utterance_text = segment.get("text", "").strip()

                    # Process utterance_text with mod_scrub_content
                    # Assuming the function is named 'scrub_content'
                    # Adjust the function name if different
                    # scrub_result = mod_scrub_content.scrub_content(utterance_text)

                    # if scrub_result.get("skip", False):
                    #     continue  # Skip this utterance

                    # processed_content = scrub_result.get("content", "").strip()
                    # if not processed_content:
                    #     continue  # If content is empty after processing, skip

                    # Convert relative start to timedelta
                    relative_start_td = timedelta(seconds=relative_start_sec)

                    # Calculate absolute ground elapsed time
                    absolute_time_td = tape_start_td + relative_start_td

                    # Format absolute_time_td to string
                    time_str = format_timedelta(absolute_time_td)

                    # Write to output
                    outfile.write(f"{time_str}|{utterance_text.strip()}\n")

                except Exception as e:
                    print(f"Error processing segment in {filename}: {e}")
                    continue

        print(f"Processed {filename} -> {output_filename}")

print("All files processed successfully.")
