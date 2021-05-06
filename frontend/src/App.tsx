
import React, { useState, useEffect, useRef } from "react";
import { Howl, Howler } from 'howler';
import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";
import SiriWave from "siriwave";

import Upload from "./components/Upload";
import FileList from "./components/FileList";
import socketIOClient from "socket.io-client";
import { FileProvider } from "./context/files";
import { useFiles } from "./context/files";

var siriWave: SiriWave | undefined;

const decrementAmplitude = () => {
  if (siriWave && siriWave.amplitude > 0) {
    siriWave.amplitude -= siriWave.amplitude * 0.1;
  }
  setTimeout(() => decrementAmplitude(), 100);
}

const App: React.FC = () => {
  const { uploadedFiles: files, deleteFile } = useFiles();
  const [response, setResponse] = useState("");
  const [waveContainer, setWaveContainer] = useState<HTMLElement>();
  const [waveSiri, setWaveSiri] = useState<SiriWave>();
  var lastPackage = "";

  const waveformRef = useRef(null);
  const body = <div ref={c => {if(c) setWaveContainer(c)}}></div>;

  useEffect(() => {
    if (!waveSiri && waveContainer) {
      const newWave = new SiriWave({
        container: waveContainer,
        width: 640,
        height: 200,
      });
      setWaveSiri(newWave);
      siriWave = newWave;
      decrementAmplitude();
    } else if (waveSiri) {
      waveSiri.amplitude += 1
    }
  }, [response]);


  useEffect(() => {
    const socket = socketIOClient("http://localhost:3333");
    socket.on("FromAPI", data => {
      if (lastPackage === JSON.stringify(data))
        return;
      lastPackage = JSON.stringify(data)
      setResponse(JSON.stringify(data));
    });
  }, []);

  return (
    <FileProvider>
      <Container>
        <Content>
          <Upload />
          <FileList />
        </Content>
          {body}
        <GlobalStyle />
      </Container>
    </FileProvider>
  )
};

export default App;
