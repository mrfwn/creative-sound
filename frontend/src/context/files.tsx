import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import filesize from "filesize";

import api from "../services/api";

export interface ISound {
  _id: string;
  name: string;
  size: number;
  key: string;
  url: string;
  url_vocals: string;
  url_bass: string;
  url_piano: string;
  url_drums: string;
  url_other: string;
}

export interface IFile {
  id: string;
  name: string;
  readableSize: string;
  uploaded?: boolean;
  preview: string;
  file: File | null;
  progress?: number;
  error?: boolean;
  url: string;
  url_vocals: string;
  url_bass: string;
  url_piano: string;
  url_drums: string;
  url_other: string;
}

interface IFileContextData {
  uploadedFiles: IFile[];
  deleteFile(id: string): void;
  handleUpload(file: any): void;
}

const FileContext = createContext<IFileContextData>({} as IFileContextData);

const FileProvider: React.FC = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);

  useEffect(() => {
    api.get<ISound[]>("sounds").then((response) => {
      const soundFormatted: IFile[] = response.data.map((sound) => {
        return {
          ...sound,
          id: sound._id,
          preview: sound.url,
          readableSize: filesize(sound.size),
          file: null,
          error: false,
          uploaded: true,
        };
      });

      setUploadedFiles(soundFormatted);
    });
  }, []);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  });

  const updateFile = useCallback((id, data) => {
    setUploadedFiles((state) =>
      state.map((file) => (file.id === id ? { ...file, ...data } : file))
    );
  }, []);

  const processUpload = useCallback(
    (uploadedFile: IFile) => {
      const data = new FormData();
      if (uploadedFile.file) {
        data.append("file", uploadedFile.file, uploadedFile.name);
      }

      api
        .post("sounds", data, {
          onUploadProgress: (progressEvent) => {
            let progress: number = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            console.log(
              `A música ${uploadedFile.name} está ${progress}% carregada... `
            );

            updateFile(uploadedFile.id, { progress });
          },
        })
        .then((response) => {
          console.log(
            `A música ${uploadedFile.name} já foi enviada para o servidor!`
          );

          updateFile(uploadedFile.id, {
            uploaded: true,
            id: response.data._id,
            url: response.data.url,
            url_bass: response.data.url_bass,
            url_piano: response.data.url_piano,
            url_drums: response.data.url_drums,
            url_other: response.data.url_other,
            url_vocals: response.data.url_vocals
          });
        })
        .catch((err) => {
          console.error(
            `Houve um problema para fazer upload da música ${uploadedFile.name} no servidor AWS`
          );
          console.log(err);

          updateFile(uploadedFile.id, {
            error: true,
          });
        });
    },
    [updateFile]
  );

  const handleUpload = useCallback(
    (files: File[]) => {
      const newUploadedFiles: IFile[] = files.map((file: File) => ({
        file,
        id: uuidv4(),
        name: file.name,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: "",
        url_vocals: "",
        url_bass: "",
        url_piano: "",
        url_drums: "",
        url_other: "",
      }));

      // concat é mais performático que ...spread
      // https://www.malgol.com/how-to-merge-two-arrays-in-javascript/
      setUploadedFiles((state) => state.concat(newUploadedFiles));
      newUploadedFiles.forEach(processUpload);
    },
    [processUpload]
  );

  const deleteFile = useCallback((id: string) => {
    api.delete(`sounds/${id}`);
    setUploadedFiles((state) => state.filter((file) => file.id !== id));
  }, []);

  return (
    <FileContext.Provider value={{ uploadedFiles, deleteFile, handleUpload }}>
      {children}
    </FileContext.Provider>
  );
};

function useFiles(): IFileContextData {
  const context = useContext(FileContext);

  if (!context) {
    throw new Error("useFiles must be used within FileProvider");
  }

  return context;
}

export { FileProvider, useFiles };
