import sys
import librosa
import ffmpeg
import os
import json

stems = ['vocals','bass','piano','drums','other']
beats = {"vocals": [],"bass": [],"piano": [],"drums": [],"other": []}
def createDir(root_path):
    for stem in stems:
        os.mkdir(root_path+'/'+stem)

def generateBeats(path_file,path_save,file_name,name):
    x, sr = librosa.load(file_name)
    in_file = ffmpeg.input(file_name)
    tempo, beat_times = librosa.beat.beat_track(x, sr=sr, start_bpm=60, units='time')

    for i in range(len(beat_times)):
        if i == (len(beat_times)-1):
            aud = (
                in_file
                .filter_('atrim', start = beat_times[i])
                .filter_('asetpts', 'PTS-STARTPTS')
            )
            file_beat_name = path_save+name+'_beat'+ str(i)+'.mp3'
            beats[name].append(name+"_beat"+ str(i)+".mp3")
            output = ffmpeg.output(aud,file_beat_name)
            output.run()
        else:
            aud = (
                in_file
                .filter_('atrim', start = beat_times[i], end = beat_times[i+1])
                .filter_('asetpts', 'PTS-STARTPTS')
            )
            file_beat_name = path_save+name+'_beat'+ str(i)+'.mp3'
            beats[name].append(name+"_beat"+ str(i)+".mp3")
            output = ffmpeg.output(aud,file_beat_name)
            output.run()

root_path = sys.argv[1][:-4]
createDir(root_path)

for stem in stems:
    path_save = root_path+'/'+stem+'/'
    file_name = root_path+'/'+stem+'.mp3'
    generateBeats(root_path, path_save, file_name,stem)

print(json.dumps(beats))


