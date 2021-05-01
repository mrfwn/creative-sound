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

  useEffect(() => {
    if (files.length > 0) {
      console.log(files)
      const audio = files ? files[0].url_bass : ''; // TODO: Change bass to be selected
      var sound = new Howl({
        src: [audio],
        sprite: {
          blast: [0, 3000],
          laser: [4000, 1000],
          winner: [6000, 5000]
        }
      });
      sound.play('laser');
    }

  }, [response])
  useEffect(() => {
    const socket = socketIOClient("http://localhost:3333");
    socket.on("FromAPI", data => {
      setResponse(JSON.stringify(data));
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
                {!!uploadedFile.url && !!uploadedFile.url_bass && !!uploadedFile.url_vocals && ( // TODO: Change bass
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
                href={uploadedFile.url_drums} // Change Bass
                target="_blank"
                rel="noopener noreferrer"
              >
                <GiDrum style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

{/* url_piano: string;
  url_drums: string; */}
  {/* url_other: string; */}
            {uploadedFile.url_piano && (
              <a
                href={uploadedFile.url_piano} // Change Bass
                target="_blank"
                rel="noopener noreferrer"
              >
                <GiMusicalKeyboard style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {uploadedFile.url_bass && (
              <a
                href={uploadedFile.url_bass} // Change Bass
                target="_blank"
                rel="noopener noreferrer"
              >
                <GiGuitar style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {uploadedFile.url_vocals && (
              <a
                href={uploadedFile.url_vocals}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdKeyboardVoice style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {uploadedFile.url && (
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
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
