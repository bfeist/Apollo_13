import os
import time
import whisperx
from rich.console import Console, Group
from rich.table import Table
from rich.live import Live
from rich.progress import (
    Progress,
    SpinnerColumn,
    BarColumn,
    TextColumn,
    TimeElapsedColumn,
    TimeRemainingColumn,
)
from rich.panel import Panel
from rich.align import Align
import importlib.metadata
import json

# ============================
# Global Configuration Variables
# ============================

input_path = "F:/A13_30-track/defluttered/"
working_path = "F:/A13_whisperx_MOCR_transcription/"

DEVICE = "cuda"
BATCH_SIZE = 16
COMPUTE_TYPE = "float16"

YOUR_HF_TOKEN = "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"

console = Console()

# ============================
# Function Definitions
# ============================


def is_float(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


def seconds_to_hms(total_seconds):
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"


def load_models():
    timings = {}

    # Step 1: Loading transcription model
    start_time = time.perf_counter()
    model_dir = os.path.join(working_path, ".model")
    model = whisperx.load_model(
        "large-v3",
        DEVICE,
        compute_type=COMPUTE_TYPE,
        download_root=model_dir,
        language="en",
    )
    end_time = time.perf_counter()
    timings["Loading Transcription Model (s)"] = end_time - start_time

    # Step 2: Loading alignment model
    start_time = time.perf_counter()
    model_a, metadata = whisperx.load_align_model(language_code="en", device=DEVICE)
    end_time = time.perf_counter()
    timings["Loading Alignment Model (s)"] = end_time - start_time

    return model, model_a, metadata, timings


def processWavWithWhisperx(wavPath, outputFile, model, model_a, metadata):
    # Step 1: Loading audio
    start_time = time.perf_counter()
    audio = whisperx.load_audio(wavPath)
    end_time = time.perf_counter()
    yield ("Loading Audio (s)", end_time - start_time)

    # Step 2: Transcribing
    start_time = time.perf_counter()
    result = model.transcribe(
        audio,
        batch_size=BATCH_SIZE,
        language="en",
    )
    end_time = time.perf_counter()
    yield ("Transcribing (s)", end_time - start_time)

    # Step 3: Aligning
    start_time = time.perf_counter()
    result = whisperx.align(
        result["segments"],
        model_a,
        metadata,
        audio,
        DEVICE,
        return_char_alignments=False,
    )
    end_time = time.perf_counter()
    yield ("Aligning (s)", end_time - start_time)

    # Step 4: Saving
    start_time = time.perf_counter()
    lowest_folder = os.path.basename(os.path.dirname(os.path.normpath(outputFile)))
    os.makedirs(os.path.join(working_path, lowest_folder), exist_ok=True)
    with open(outputFile, "w") as f:
        f.write(json.dumps(result, indent=2))
    end_time = time.perf_counter()
    yield ("Saving (s)", end_time - start_time)


def collect_files():
    files_to_process = []
    for root, dirs, files in os.walk(input_path):
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            try:
                for file in os.listdir(dir_path):
                    if (
                        not file.endswith(".wav")
                        or "CH1.wav" in file
                        or "CH01.wav" in file
                        or "CH30.wav" in file
                        or "CH31.wav" in file
                        or "CH32.wav" in file
                    ):
                        continue

                    # if file is zero bytes, skip
                    if os.path.getsize(os.path.join(dir_path, file)) == 0:
                        continue

                    input_filename = file
                    input_filepath = os.path.join(dir_path, input_filename)

                    output_dir = os.path.join(working_path, dir.replace("_16khz", ""))
                    output_file = os.path.join(
                        output_dir,
                        file.replace(".wav", "") + "_whisperx_aligned_transcript.json",
                    )

                    if os.path.exists(output_file):
                        console.log(
                            f"Skipping [green]{output_file}[/green] because it already exists"
                        )
                        continue

                    files_to_process.append((input_filepath, output_file))
            except OSError as e:
                console.log(f"[red]Error processing {dir_path}: {e}[/red]")
    return files_to_process


def main():
    console.print("[bold yellow]Loading models...[/bold yellow]")
    try:
        model, model_a, metadata, model_timings = load_models()
    except Exception as e:
        console.print(f"[bold red]Error loading models: {e}[/bold red]")
        return
    console.print(
        f"Transcription Model loaded in {model_timings['Loading Transcription Model (s)']:.2f} seconds"
    )
    console.print(
        f"Alignment Model loaded in {model_timings['Loading Alignment Model (s)']:.2f} seconds\n"
    )

    console.print("[bold yellow]Collecting files to process...[/bold yellow]")
    files_to_process = collect_files()
    total_files = len(files_to_process)
    if total_files == 0:
        console.print("[bold red]No eligible WAV files found to process.[/bold red]")
        return
    console.print(f"Total files to process: [bold]{total_files}[/bold]\n")

    table_data = []

    progress = Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        "[progress.percentage]{task.percentage:>3.0f}%",
        "•",
        TimeElapsedColumn(),
        "•",
        TimeRemainingColumn(),
        expand=True,
    )
    task = progress.add_task("[green]Processing files...", total=total_files)

    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Filename", style="cyan", no_wrap=True)
    table.add_column("Loading Audio (s)", justify="right")
    table.add_column("Transcribing (s)", justify="right")
    table.add_column("Aligning (s)", justify="right")
    table.add_column("Saving (s)", justify="right")
    table.add_column("Total (s)", style="green", justify="right")

    group = Group(
        Panel(Align.center(table), title="Processing Times for WhisperX"),
        Panel(progress, title="Progress"),
    )

    with Live(group, refresh_per_second=4, console=console, screen=True) as live:
        for input_file, output_file in files_to_process:
            filename = os.path.basename(input_file)
            console.log(f"[blue]Processing {filename}[/blue]")

            # Initialize row data with empty timings
            row = {
                "Filename": filename,
                "Loading Audio (s)": "",
                "Transcribing (s)": "",
                "Aligning (s)": "",
                "Saving (s)": "",
            }
            table_data.append(row)

            # Process the file step by step
            for step, duration in processWavWithWhisperx(
                input_file, output_file, model, model_a, metadata
            ):
                # Update the current row with the step duration
                row[step] = f"{duration:.2f}"

                # Rebuild the table with updated data
                table = Table(show_header=True, header_style="bold magenta")
                table.add_column("Filename", style="cyan", no_wrap=True)
                table.add_column("Loading Audio (s)", justify="right")
                table.add_column("Transcribing (s)", justify="right")
                table.add_column("Aligning (s)", justify="right")
                table.add_column("Saving (s)", justify="right")
                table.add_column("Total (s)", style="green", justify="right")

                for data in table_data:
                    table.add_row(
                        data["Filename"],
                        data["Loading Audio (s)"],
                        data["Transcribing (s)"],
                        data["Aligning (s)"],
                        data["Saving (s)"],
                        f"{seconds_to_hms(sum(float(data[step]) for step in row if data[step] and is_float(data[step])))}",
                    )

                # Update the Live view with the updated table
                group = Group(
                    Panel(Align.center(table), title="Processing Times for WhisperX"),
                    Panel(progress, title="Progress"),
                )
                live.update(group)  # This line forces the Live display to refresh

            # Advance the progress bar after processing the file
            progress.advance(task)

    console.print("\n[bold green]Processing complete![/bold green]")


if __name__ == "__main__":
    main()
