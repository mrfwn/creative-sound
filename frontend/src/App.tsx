import React, { useState, useEffect } from "react";
import { Howl, Howler } from 'howler';
import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";

import Upload from "./components/Upload";
import FileList from "./components/FileList";
import socketIOClient from "socket.io-client";
import { FileProvider } from "./context/files";
import { useFiles } from "./context/files";

const App: React.FC = () => {
  const { uploadedFiles: files, deleteFile } = useFiles();
  const [response, setResponse] = useState("");


  useEffect(() => {
    const socket = socketIOClient("http://localhost:3333");
    socket.on("FromAPI", data => {
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
        <h1>{response}</h1>
        <GlobalStyle />
      </Container>
    </FileProvider>
  )
};

export default App;
