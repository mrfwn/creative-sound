import React, { useEffect, useState} from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Howl } from 'howler';
import { MdCheckCircle, MdError, MdMoodBad, MdKeyboardVoice } from "react-icons/md";
import { FaMusic } from "react-icons/fa";
import { GiMusicalKeyboard, GiGuitar, GiDrum } from "react-icons/gi";
import { useFiles } from "../../context/files";
import { IFile } from "../../context/files";
import socketIOClient from "socket.io-client";


import { Container, FileInfo, Preview } from "./styles";
import { Dictionary } from "lodash";


const FileList = () => {
  const { uploadedFiles: files, deleteFile } = useFiles();
  const [response, setResponse] = useState<any>({});
  const [audioSrc, setAudioSrc] = useState("");
  var lastPackage = "";
  const [sounds, setSounds] = useState<Dictionary<Howl>>({});
  const [soundIds, setSoundIds] = useState<Dictionary<number>>({});
  const [soundLoop, setSoundLoop] = useState<boolean>(false);

  const getProperCss = (src: string) => {
    const css = {cursor:"pointer", borderStyle: "none", width: 32, height: 32};
    if (src === audioSrc) {
      css.borderStyle = "dotted";
    }
    return css
  }

  const getHowl = (audio: string): Howl => {
    return new Howl({
      src: [audioSrc],
      sprite: {
        push1false:    [0   , 1000],
        push2false:    [1000, 1000],
        push3false:    [2000, 1000],
        push4false:    [3000, 1000],
        push5false:    [4000, 1000],
        push6false:    [5000, 1000],
        push7false:    [6000, 1000],
        push8false:    [7000, 1000],
        push9false:    [8000, 1000],
        push10false:   [9000, 1000],
        push1true:     [0   , 1000, true],
        push2true:     [1000, 1000, true],
        push3true:     [2000, 1000, true],
        push4true:     [3000, 1000, true],
        push5true:     [4000, 1000, true],
        push6true:     [5000, 1000, true],
        push7true:     [6000, 1000, true],
        push8true:     [7000, 1000, true],
        push9true:     [8000, 1000, true],
        push10true:    [9000, 1000, true],
      }
    })
  };

  useEffect(() => {
    if (audioSrc === "")
      return;
    
    const address = (response && response.address) || "";
    const value = (response && response.args && response.args[0] && response.args[0].value) || 0;

    if (address.includes("push")) {
      if (value !== 0) {
        const sprite = address.split('/')[2] + soundLoop;
        const soundId = audioSrc + sprite + soundLoop;
        var sound = sounds[audioSrc]
        if (sound === undefined) {
          sound = getHowl(audioSrc);
          var newSounds = sounds;
          newSounds[audioSrc] = sound;
          setSounds(newSounds);
        }

        const newSoundIds = soundIds;
        if (soundLoop) {
          if (soundIds[soundId]) {
            sound.stop(soundIds[soundId]);
            delete newSoundIds[soundId];
          } else {
            newSoundIds[soundId] = sound.play(sprite);
          }
        } else {
          newSoundIds[soundId] = sound.stop(soundIds[soundId]).play(soundIds[soundId] || sprite);
        }
        setSoundIds(newSoundIds);
      }
    } else if (address.includes("toggle")) {
      setSoundLoop(value === 1);
    }
  }, [response]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3333");
    socket.on("FromAPI", data => {
      if (lastPackage === JSON.stringify(data))
        return;
        lastPackage = JSON.stringify(data)
      
      setResponse(data);
    });
  }, []);

  if (!files.length)
    return (
      <span>
        <MdMoodBad
          style={{ marginLeft: "45%", marginTop: 10 }}
          size={24}
          color="#d5d2d2"
        />
      </span>
    );

  return (
    <Container>
      {files.map((uploadedFile: IFile) => (
        <li key={uploadedFile.id}>
          <FileInfo>
            <Preview src={uploadedFile.preview} />
            <div>
              <strong>{uploadedFile.name}</strong>
              <span>
                {uploadedFile.readableSize}{" "}
                {!!uploadedFile.url && (
                  <button onClick={(e) => deleteFile(uploadedFile.id)}>
                    Excluir
                  </button>
                )}
              </span>
            </div>
          </FileInfo>

          <div>
            {!uploadedFile.uploaded && !uploadedFile.error && (
              <CircularProgressbar
                styles={{
                  root: { width: 24 },
                  path: { stroke: "#7159c1" },
                }}
                strokeWidth={10}
                text={String(uploadedFile.progress)}
                value={uploadedFile.progress || 0}
              />
            )}

            {uploadedFile.url_drums && (
              <div
              style={getProperCss(uploadedFile.url_drums)}
              onClick={() => setAudioSrc(uploadedFile.url_drums)}
              >
                <GiDrum style={{ marginRight: 8 }} size={24} color="#222" />
              </div>
            )}
            
            {uploadedFile.url_piano && (
              <div
              style={getProperCss(uploadedFile.url_piano)}
                onClick={() => setAudioSrc(uploadedFile.url_piano)}
              >
                <GiMusicalKeyboard style={{ marginRight: 8 }} size={24} color="#222" />
              </div>
            )}

            {uploadedFile.url_bass && (
              <div
              style={getProperCss(uploadedFile.url_bass)}
              onClick={() => setAudioSrc(uploadedFile.url_bass)}
              >
                <GiGuitar style={{ marginRight: 8 }} size={24} color="#222" />
              </div>
            )}

            {uploadedFile.url_vocals && (
              <div
              style={getProperCss(uploadedFile.url_vocals)}
              onClick={() => setAudioSrc(uploadedFile.url_vocals)}
              >
                <MdKeyboardVoice style={{ marginRight: 8 }} size={24} color="#222" />
              </div>
            )}

            {uploadedFile.url && (
              <div
              style={getProperCss(uploadedFile.url)}
              onClick={() => setAudioSrc(uploadedFile.url)}
              >
                <FaMusic style={{ marginRight: 8 }} size={24} color="#222" />
              </div>
            )}

            {uploadedFile.uploaded && (
              <MdCheckCircle size={24} color="#78e5d5" />
            )}
            {uploadedFile.error && <MdError size={24} color="#e57878" />}
          </div>
        </li>
      ))}
    </Container>
  );
};

export default FileList;
