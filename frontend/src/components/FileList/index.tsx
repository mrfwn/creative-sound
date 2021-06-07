import React from "react";
import { useFiles } from "../../context/files";
import { IFile } from "../../context/files";

import { Container, FileInfo } from "./styles";


const FileList = () => {
  const { uploadedFiles: files, selectMusic, selectedFile } = useFiles();

  return (
    <Container>
      {files.length > 0 && files.map((uploadedFile: IFile) => (
        <li key={uploadedFile.id}>
          <FileInfo active={selectedFile !== undefined && uploadedFile.id === selectedFile.id} onClick={(e) => selectMusic(uploadedFile)}>
            <strong>{uploadedFile.name}</strong>
          </FileInfo>

        </li>
      ))}
    </Container>
  );
};

export default FileList;
