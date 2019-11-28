import os

inputRoot = 'E:\\Apollo_13_Data_Delivery\\44.1\\defluttered\\'
outputRoot = 'H:\\A13_mp3\\'

# inputRoot = 'E:/Apollo_13_Data_Delivery/44.1/defluttered/'
# outputRoot = 'H:/A13_mp3/'

for tapeName in os.listdir(inputRoot):
    inputDirectory = inputRoot + tapeName
    inputDirectoryFS = os.fsencode(inputDirectory)

    outputDirectory = outputRoot + tapeName + '_mp3_16'


    for channelfile in os.listdir(inputDirectoryFS):
        filename = os.fsdecode(channelfile)
        if filename.endswith(".wav"):
            output_file_name_and_path = outputDirectory + "\\" + os.path.splitext(filename)[0] + ".mp3"

            # constant bitrate, 16kb/s, 8khz sampling rate, highest quality algorithm
            command = "lame --cbr -b 16 --resample 8 -m m -q 0 " + inputDirectory + "\\" + filename + " " + output_file_name_and_path

            # if trace output exists, skip
            if os.path.exists(output_file_name_and_path):
                print("mp3 file EXISTS, SKIPPING: " + output_file_name_and_path)
            else:
                if not os.path.exists(outputDirectory):
                    os.makedirs(outputDirectory)
                os.system(command)