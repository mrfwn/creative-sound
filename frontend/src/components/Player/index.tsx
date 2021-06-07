import React, { useCallback, useEffect, useState } from "react";
import { Howl } from 'howler';
import { FaMusic } from "react-icons/fa";
import { GiPianoKeys, GiGuitar, GiDrum, GiMicrophone } from "react-icons/gi";
import { InstrumentType, useFiles } from "../../context/files";
import { AiFillSound } from 'react-icons/ai';
import socketIOClient from "socket.io-client";


import { Container, Band, Instrument, TimeLine, Trail, Beat } from "./styles";
enum Protocol {
    Midi = 'midi',
    Osc = 'osc',
}

const Player = () => {
    const { updateNote, selectedFile } = useFiles();
    const [protocol] = useState('midi');
    const [note, setNote] = useState('');
    const [vocalSelect, setVocalSelect] = useState(false);
    const [bassSelect, setBassSelect] = useState(false);
    const [pianoSelect, setPianoSelect] = useState(false);
    const [drumSelect, setDrumSelect] = useState(false);
    const [otherSelect, setOtherSelect] = useState(false);

    const playBeat = useCallback((audio: string) => {
        const sound = new Howl({ src: [audio] });
        sound.play();
        setNote('-1');
    }, []);


    useEffect(() => {
        selectedFile?.urls_beats_vocals.forEach((beat) => beat.note && beat.note === String(note) && playBeat(beat.url));
        selectedFile?.urls_beats_bass.forEach((beat) => beat.note && beat.note === String(note) && playBeat(beat.url));
        selectedFile?.urls_beats_piano.forEach((beat) => beat.note && beat.note === String(note) && playBeat(beat.url));
        selectedFile?.urls_beats_drums.forEach((beat) => beat.note && beat.note === String(note) && playBeat(beat.url));
        selectedFile?.urls_beats_other.forEach((beat) => beat.note && beat.note === String(note) && playBeat(beat.url));
    }, [playBeat, selectedFile, note])

    useEffect(() => {
        switch (protocol) {
            case Protocol.Midi:
                navigator.requestMIDIAccess().then(({ inputs }) => {
                    inputs.values().next().value.onmidimessage = ({ data }: any) => {
                        setNote(data[1]);
                        /*
                        setResponse({
                            channel: data[0] & 0xf,
                            cmd: data[0] >> 4,
                            type: data[0] & 0xf0,
                            note: data[1],
                            velocity: data[2]
                        });*/
                    }
                });
                break;
            case Protocol.Osc:
                const socket = socketIOClient("http://localhost:3333");
                socket.on("FromAPI", data => {
                    if ('' === JSON.stringify(data)) return;
                    //lastPackage = JSON.stringify(data)
                    //setResponse(data);
                });
                break;
        }
    }, [protocol]);


    return (
        <Container>

            {selectedFile && <>
                <Band>

                    {selectedFile.urls_beats_vocals.length > 0 && <Instrument active={vocalSelect} onClick={() => setVocalSelect(!vocalSelect)}>
                        <GiMicrophone size={44} />
                        <strong>Vocals</strong>
                    </Instrument>}
                    {selectedFile.urls_beats_bass.length > 0 && <Instrument active={bassSelect} onClick={() => setBassSelect(!bassSelect)}>
                        <GiGuitar size={44} />
                        <strong>Bass</strong>
                    </Instrument>}
                    {selectedFile.urls_beats_piano.length > 0 && <Instrument active={pianoSelect} onClick={() => setPianoSelect(!pianoSelect)}>
                        <GiPianoKeys size={44} />
                        <strong>Piano</strong>
                    </Instrument>}
                    {selectedFile.urls_beats_drums.length > 0 && <Instrument active={drumSelect} onClick={() => setDrumSelect(!drumSelect)}>
                        <GiDrum size={44} />
                        <strong>Drum</strong>
                    </Instrument>}
                    {selectedFile.urls_beats_other.length > 0 && <Instrument active={otherSelect} onClick={() => setOtherSelect(!otherSelect)}>
                        <FaMusic size={44} />
                        <strong>Other</strong>
                    </Instrument>}

                </Band>
                <TimeLine>
                    {vocalSelect && <Trail>
                        <Beat onClick={() => playBeat(selectedFile.url_vocals)}>
                            <GiMicrophone size={34} />
                        </Beat>
                        {
                            selectedFile.urls_beats_vocals.map(beat => (
                                <Beat>
                                    <strong>Beat {beat.index}</strong>
                                    <input type="text" value={beat.note} onChange={(e) => updateNote(e.target.value, selectedFile, beat.index, InstrumentType.Vocals)} />
                                    <AiFillSound onClick={() => playBeat(beat.url)} size={24} />
                                </Beat>
                            ))
                        }
                    </Trail>
                    }
                    {bassSelect && <Trail>
                        <Beat onClick={() => playBeat(selectedFile.url_bass)}>
                            <GiGuitar size={34} />
                        </Beat>
                        {
                            selectedFile.urls_beats_bass.map(beat => (
                                <Beat>
                                    <strong>Beat {beat.index}</strong>
                                    <input type="text" value={beat.note} onChange={(e) => updateNote(e.target.value, selectedFile, beat.index, InstrumentType.Bass)} />
                                    <AiFillSound onClick={() => playBeat(beat.url)} size={24} />
                                </Beat>
                            ))
                        }
                    </Trail>
                    }
                    {pianoSelect && <Trail>
                        <Beat onClick={() => playBeat(selectedFile.url_piano)}>
                            <GiPianoKeys size={34} />
                        </Beat>
                        {
                            selectedFile.urls_beats_piano.map(beat => (
                                <Beat>
                                    <strong>Beat {beat.index}</strong>
                                    <input type="text" value={beat.note} onChange={(e) => updateNote(e.target.value, selectedFile, beat.index, InstrumentType.Piano)} />
                                    <AiFillSound onClick={() => playBeat(beat.url)} size={24} />
                                </Beat>
                            ))
                        }
                    </Trail>
                    }
                    {drumSelect && <Trail>
                        <Beat onClick={() => playBeat(selectedFile.url_drums)}>
                            <GiDrum size={34} />
                        </Beat>
                        {
                            selectedFile.urls_beats_drums.map(beat => (
                                <Beat>
                                    <strong>Beat {beat.index}</strong>
                                    <input type="text" value={beat.note} onChange={(e) => updateNote(e.target.value, selectedFile, beat.index, InstrumentType.Drums)} />
                                    <AiFillSound onClick={() => playBeat(beat.url)} size={24} />
                                </Beat>
                            ))
                        }
                    </Trail>
                    }
                    {otherSelect && <Trail>
                        <Beat onClick={() => playBeat(selectedFile.url_other)}>
                            <FaMusic size={34} />
                        </Beat>
                        {
                            selectedFile.urls_beats_other.map(beat => (
                                <Beat>
                                    <strong>Beat {beat.index}</strong>
                                    <input type="text" value={beat.note} onChange={(e) => updateNote(e.target.value, selectedFile, beat.index, InstrumentType.Other)} />
                                    <AiFillSound onClick={() => playBeat(beat.url)} size={24} />
                                </Beat>
                            ))
                        }
                    </Trail>
                    }

                </TimeLine>

            </>}

        </Container>
    );
};

export default Player;
