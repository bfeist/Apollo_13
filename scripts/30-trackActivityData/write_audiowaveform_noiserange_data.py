import json
import math
import os
import numpy
from pprint import pprint

# Step 1of3. 2 is write_audiowaveform_tape_json.py.
# This script generates data files that contain time ranges of tape channels that contain activity
# It reads through all 30-track mp3 folders and creates a /noiseranges subfolder with one csv per channel
# The step after creating these datafiles is to run write_audiowaveform_tape_json.py which pivots these data files
# into a single json per tape with one entry per second that contains an array showing which channels are active
# in that second

# samples_per_ms = 8
samples_per_peakval = 128
samples_per_second = 8000
peakvals_per_second = 62.5
silent_seconds_before_closing_noise_range = 12

# wave_root_path = "F:/mp3/"
root_path = "H:/A13_mp3/"


def getMedian(numericValues):
    theValues = sorted(numericValues)

    if len(theValues) % 2 == 1:
        return theValues[int((len(theValues)+1)/2-1)]
    else:
        lower = theValues[int(len(theValues)/2-1)]
        upper = theValues[int(len(theValues)/2)]
        return (float(lower + upper)) / 2


def timestampBySeconds(seconds):
    hours = int(math.fabs(seconds / 3600))
    minutes = int(math.fabs(seconds / 60)) % 60 % 60
    seconds = math.floor(int(math.fabs(seconds)) % 60)

    return str(hours).zfill(3) + ":" + str(minutes).zfill(2) + ":" + str(seconds).zfill(2)


for tapeName in os.listdir(root_path):
    inputDirectory = root_path + tapeName + '/audiowaveform_256_json'
    inputDirectoryFS = os.fsencode(inputDirectory)

    outputDirectory = root_path + tapeName + '/noiseranges'
    if not os.path.exists(outputDirectory):
        os.makedirs(outputDirectory)
        for channelfile in os.listdir(inputDirectoryFS):
            filename = os.fsdecode(channelfile)
            with open(inputDirectory + "/" + filename) as data_file:
                output_file_name_and_path = outputDirectory + "/" + os.path.splitext(filename)[0] + ".csv"
                outputFile = open(output_file_name_and_path, "w")
                print(output_file_name_and_path)

                json_data = json.load(data_file)
                abs_wav_data = [abs(number) for number in json_data["data"]]

                # calculate noise threshold for silence
                # unique_values = numpy.unique(abs_wav_data)
                # median_loudness = getMedian(abs_wav_data)
                # silence_threshold = numpy.percentile(abs_wav_data,  25)
                # # silence_threshold = numpy.percentile(abs_wav_data, numpy.arange(0, 100, 25))

                sample_counter = 0
                seconds_counter = 0
                accum_val = 0
                prev_second = 0
                range_start = 0
                range_stop = 0
                concurrent_seconds_of_silence = 0
                for peak_val in abs_wav_data:  # loop through the json sample array. these are in min/max val pairs, so 128 samples per value
                    accum_val += peak_val  # add together all of the peak values over one second
                    sample_counter += samples_per_peakval
                    curr_second = math.floor(sample_counter / samples_per_second)  # seconds rollover detector
                    if curr_second > prev_second:  # process previous second
                        peak_average_over_second = accum_val / peakvals_per_second  # how loud was this second
                        if peak_average_over_second > 4:  # TODO somehow figure out how to compare to average tape noise to avoid detecting hum
                            if range_start == 0:
                                range_start = prev_second - 2  # start counting a noise range and start 2 seconds before the noise started
                            concurrent_seconds_of_silence = 0  #  reset the concurrent seconds of silence because we heard a noise
                        elif range_start != 0:  # if a noise detection range has already been started
                            concurrent_seconds_of_silence += 1  # increment seconds of silence detection
                            if concurrent_seconds_of_silence == silent_seconds_before_closing_noise_range:  # if silence range detection duration has been hit
                                range_stop = prev_second - (silent_seconds_before_closing_noise_range - 1)  # calculate range stop as at the beginning of silence range
                                if range_stop - range_start >= 2:  # if two or more seconds of sound
                                    print(timestampBySeconds(range_start) + " - " + timestampBySeconds(range_stop))
                                    # outputLine = "{0}|{1}\n".format(range_start, range_stop)
                                    outputLine = "{0}|{1}\n".format(timestampBySeconds(range_start), timestampBySeconds(range_stop))
                                    outputFile.write(outputLine)
                                range_start = 0  # reset range
                                range_stop = 0
                                concurrent_seconds_of_silence = 0
                        accum_val = 0
                        prev_second = curr_second

                    # if curr_second > 10000:
                    #     break
                outputFile.close()
    else:
        print("noiseranges folder already created. tape skipped")
