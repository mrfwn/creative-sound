import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Howl, Howler } from 'howler';
import { MdCheckCircle, MdError, MdMoodBad, MdKeyboardVoice } from "react-icons/md";
import { FaMusic } from "react-icons/fa";
import { GiMusicalKeyboard, GiGuitar, GiDrum } from "react-icons/gi";
import { useFiles } from "../../context/files";
import { IFile } from "../../context/files";
import socketIOClient from "socket.io-client";


import { Container, FileInfo, Preview } from "./styles";


const FileList = () => {
  const { uploadedFiles: files, deleteFile } = useFiles();
  const [response, setResponse] = useState("");
  const [audioSrc, setAudioSrc] = useState("");

  const getProperCss = (src: string) => {
    const css = {cursor:"pointer", borderStyle: "none"};
    if (src == audioSrc) {
      css.borderStyle = "solid";
    }
    return css
  }

  useEffect(() => {
    if (files.length > 0) {
      const audio = audioSrc;
      var sound = new Howl({ // TODO: Change the way sound is setted
        src: [audio],
        sprite: {
          blast: [0, 3000],
          laser: [4000, 1000],
          winner: [6000, 5000]
        }
      });
      sound.play('winner');
    }

  }, [response]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3333");
    socket.on("FromAPI", data => {
      setResponse(JSON.stringify(data));
    });
  }, []);

  useEffect(() => {
    const data = {"address":"/3/push1","args":[{"type":"f","value":0}]};
    setResponse(JSON.stringify(data));
    console.log(data)
  }, [audioSrc]);

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
              <a
              style={getProperCss(uploadedFile.url_drums)}
              onClick={() => setAudioSrc(uploadedFile.url_drums)}
              >
                <GiDrum style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}
            
            {uploadedFile.url_piano && (
              <a
              style={getProperCss(uploadedFile.url_piano)}
                onClick={() => setAudioSrc(uploadedFile.url_piano)}
              >
                <GiMusicalKeyboard style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {uploadedFile.url_bass && (
              <a
              style={getProperCss(uploadedFile.url_bass)}
              onClick={() => setAudioSrc(uploadedFile.url_bass)}
              >
                <GiGuitar style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {uploadedFile.url_vocals && (
              <a
              style={getProperCss(uploadedFile.url_vocals)}
              onClick={() => setAudioSrc(uploadedFile.url_vocals)}
              >
                <MdKeyboardVoice style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {uploadedFile.url && (
              <a
              style={getProperCss(uploadedFile.url)}
              onClick={() => setAudioSrc(uploadedFile.url)}
              >
                <FaMusic style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
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
