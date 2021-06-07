
import React from "react";

import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";

import Upload from "./components/Upload";
import FileList from "./components/FileList";
import Player from "./components/Player";
import { FileProvider } from "./context/files";



const App: React.FC = () => {


  return (
    <FileProvider>
      <Container>
        <Content>
          <Upload />
          <FileList />
        </Content>
        <Player />
        <GlobalStyle />
      </Container>
    </FileProvider>
  )
};

export default App;
