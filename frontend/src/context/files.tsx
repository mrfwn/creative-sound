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
  urls_beats_vocals: string[];
  urls_beats_bass: string[];
  urls_beats_piano: string[];
  urls_beats_drums: string[];
  urls_beats_other: string[];
}

export enum InstrumentType {
  Vocals = 'vocals',
  Bass = 'bass',
  Piano = 'piano',
  Drums = 'drums',
  Other = 'other'

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
  select: boolean;
  urls_beats_vocals: Beat[];
  urls_beats_bass: Beat[];
  urls_beats_piano: Beat[];
  urls_beats_drums: Beat[];
  urls_beats_other: Beat[];
}

export type Beat = {
  url: string;
  note: string | undefined;
  index: number;
}

interface IFileContextData {
  uploadedFiles: IFile[];
  selectedFile: IFile | undefined;
  deleteFile(id: string): void;
  handleUpload(file: any): void;
  selectMusic(file: IFile): void;
  updateNote(note: string, uploadedFile: IFile, index: number, instrument: string): void;
}

const FileContext = createContext<IFileContextData>({} as IFileContextData);

const FileProvider: React.FC = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFile | undefined>(undefined);
  useEffect(() => {
    api.get<ISound[]>("sounds").then((response) => {
      const soundFormatted: IFile[] = response.data.map((sound) => {
        return {
          ...sound,
          urls_beats_vocals: sound.urls_beats_vocals.map((url, index) => ({ note: undefined, url, index })),
          urls_beats_bass: sound.urls_beats_bass.map((url, index) => ({ note: undefined, url, index })),
          urls_beats_piano: sound.urls_beats_piano.map((url, index) => ({ note: undefined, url, index })),
          urls_beats_drums: sound.urls_beats_drums.map((url, index) => ({ note: undefined, url, index })),
          urls_beats_other: sound.urls_beats_other.map((url, index) => ({ note: undefined, url, index })),
          id: sound._id,
          preview: sound.url,
          readableSize: filesize(sound.size),
          file: null,
          error: false,
          uploaded: true,
          select: false
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
            url_vocals: response.data.url_vocals,
            select: false
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
        urls_beats_vocals: [],
        urls_beats_bass: [],
        urls_beats_piano: [],
        urls_beats_drums: [],
        urls_beats_other: [],
        select: false
      }));

      setUploadedFiles((state) => state.concat(newUploadedFiles));
      newUploadedFiles.forEach(processUpload);
    },
    [processUpload]
  );

  const deleteFile = useCallback((id: string) => {
    api.delete(`sounds/${id}`);
    setUploadedFiles((state) => state.filter((file) => file.id !== id));
  }, []);

  const selectMusic = useCallback((file: IFile) => {
    file.uploaded && setSelectedFile(file);
  }, []);

  const updateNote = useCallback((note: string, uploadedFile: IFile, index: number, instrument: string) => {
    switch (instrument) {
      case InstrumentType.Vocals:
        uploadedFile.urls_beats_vocals[index].note = note;
        updateFile(uploadedFile.id, { ...uploadedFile });
        setSelectedFile(uploadedFile);
        break;
      case InstrumentType.Bass:
        uploadedFile.urls_beats_bass[index].note = note;
        updateFile(uploadedFile.id, { ...uploadedFile });
        setSelectedFile(uploadedFile);
        break;
      case InstrumentType.Piano:
        uploadedFile.urls_beats_piano[index].note = note;
        updateFile(uploadedFile.id, { ...uploadedFile });
        setSelectedFile(uploadedFile);
        break;
      case InstrumentType.Drums:
        uploadedFile.urls_beats_drums[index].note = note;
        updateFile(uploadedFile.id, { ...uploadedFile });
        setSelectedFile(uploadedFile);
        break;
      case InstrumentType.Other:
        uploadedFile.urls_beats_other[index].note = note;
        updateFile(uploadedFile.id, { ...uploadedFile });
        setSelectedFile(uploadedFile);
        break;
    }
  }, [updateFile]);

  return (
    <FileContext.Provider value={{ selectedFile, uploadedFiles, deleteFile, handleUpload, selectMusic, updateNote }}>
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
