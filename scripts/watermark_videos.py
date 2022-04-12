import os

# inputRoot = 'E:\\Apollo_13_Data_Delivery\\44.1\\defluttered\\'
# inputRoot = r"E:\Apolloinrealtime renders\A13\HD\"
inputRoot = 'E:/Apolloinrealtime renders/A13/HD/'
# outputRoot = 'O:\\Apollo_13_30-Track\\44.1\\A13_mp3\\'
# outputRoot = r"E:\Apolloinrealtime renders\A13\HD\watermarked\\"
outputRoot = 'E:/Apolloinrealtime renders/A13/HD/watermarked/'

# inputRoot = 'E:/Apollo_13_Data_Delivery/44.1/defluttered/'
# outputRoot = 'H:/A13_mp3/'

for vidFile in os.listdir(inputRoot):
    filename = os.fsdecode(vidFile)
    if filename.endswith(".mp4"):
        output_file_name_and_path = outputRoot + os.path.splitext(filename)[0] + "_wm.mp4"

        # command = "lame --cbr -b 16 --resample 8 -m m -q 0 " + inputDirectory + "\\" + filename + ' "' + output_file_name_and_path + '"'
        command = 'ffmpeg -hwaccel_output_format cuda -i "' + inputRoot + filename + '" -i "' + inputRoot + 'video_watermark_1440.png" -filter_complex "[0:v][1:v]overlay" -c:v h264_nvenc -acodec copy "' + output_file_name_and_path + '"'
        # command = 'ffmpeg -hwaccel_output_format cuda -i "' + inputRoot + filename + '" -i "' + inputRoot + 'video_watermark_1440.png" -filter_complex "[0:v][1:v]overlay" -c:v h264_nvenc -rc vbr_hq -qmin 0 -cq 16 -acodec copy "' + output_file_name_and_path + '"'

        # if output file exists, skip
        outputExists = False
        for outFile in os.listdir(outputRoot):
            if outFile[0:10] == filename[0:10]:
                outputExists = True
        # if os.path.exists(output_file_name_and_path[0:10]):
        if outputExists:
            print("watermarked file EXISTS, SKIPPING: " + output_file_name_and_path)
        else:
            if not os.path.exists(outputRoot):
                os.makedirs(outputRoot)
            print(command)
            os.system(command)
