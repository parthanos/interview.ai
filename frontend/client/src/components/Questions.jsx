import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import "./questions.css"
import { useNavigate } from 'react-router-dom';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

// import "./styles.css"


// let gumStream = null;
// let recorder = null;
// let audioContext = null;



const Questions = ({ ques, updateRes, f }) => {
    // const {
    //     startRecording,
    //     stopRecording,
    //     togglePauseResume,
    //     recordingBlob,
    //     isRecording,
    //     isPaused,
    //     recordingTime,
    //     mediaRecorder
    // } = useAudioRecorder();
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState();
    const [disabled, setDisabled] = useState([]);
    const [imp, setImp] = useState();
    var startTime, endTime;

    // useEffect(() => {
    //     // if (!recordingBlob) return ()=>{};
    //     const formData = new FormData();
    //     // Append the Blob to the FormData object
    //     formData.append('audio', recordingBlob, 'audio.wav');

    //     try {
    //         const response = axios.post('/api/upload-audio', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         // Handle response as needed
    //         console.log('Response:', response.data);
    //     } catch (error) {
    //         console.error('Error uploading audio:', error);
    //     }
    //     // return ()=>{}
    //     // recordingBlob will be present at this point after 'stopRecording' has been called
    // }, [recordingBlob])

    const recorderControls = useAudioRecorder(
        {
            noiseSuppression: true,
            echoCancellation: true,
        },
        (err) => console.table(err) // onNotAllowedOrFound
    );
    const addAudioElement = async (blob) => {
        const url = await URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;
        document.body.appendChild(audio);
    };


    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const navigate = useNavigate();

    const startListening = async () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        recorderControls.startRecording();

        // startRecording();

        // let constraints = {
        //     audio: true,
        //     video: false
        // }

        // audioContext = new window.AudioContext();
        // console.log("sample rate: " + audioContext.sampleRate);

        // navigator.mediaDevices
        //     .getUserMedia(constraints)
        //     .then(async function (stream) {
        //         console.log("initializing Recorder.js ...");

        //         gumStream = stream;

        //         let input = audioContext.createMediaStreamSource(stream);

        //         recorder = await new window.Recorder(input, {
        //             numChannels: 1
        //         })

        //         recorder.record();
        //         console.log("Recording started");
        //     }).catch(function (err) {
        //         //enable the record button if getUserMedia() fails
        //     });

    }
    const stopListening = async (key) => {
        // console.log("stopButton clicked");

        // recorder.stop(); //stop microphone access
        // gumStream.getAudioTracks()[0].stop();

        // recorder.exportWAV(onStop);
        SpeechRecognition.stopListening();
        setImp(key);
        // stopRecording();
        // await setAnswers([...answers, { q: ques[key], a: transcript }])
        recorderControls.stopRecording();

    }
    // const onStop = async (blob) => {
    //     console.log("uploading...");

    //     let data = new FormData();

    //     data.append('text', "this is the transcription of the audio file");
    //     // datas.append('wavfile', blob, "recording.wav");
    //     for (let pair of data.entries()) {
    //         console.log(pair[0]+ ', ' + pair[1]); 
    //     }
    //     const config = {
    //         headers: { 'content-type': 'multipart/form-data' }
    //     }
    //     axios.post('http://localhost:4000/asr', data, config).catch(function (error) {
    //         console.log(error);
    //     });;
    // }

    const submitAnswers = () => {
        axios.post('http://localhost:4000/answers', answers)
            .then(async function (response) {
                setResults(response.data)
                await updateRes(response.data)
                navigate('/results')
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    if (!browserSupportsSpeechRecognition) {
        return null
    }




    return (
        <div className='ques-container'>
            <div className="main-content">
                {listening ? "Mic on: " : "Mic off: "}{transcript}
            </div>
            <div className="msg">
                {recorderControls.isRecording?"Great response!! Take a deep breath!":""}
            </div>

            <div className='questions'>
                {ques.map((item, key) =>
                    <div className="container">
                        <h2>Question {key + 1}</h2>

                        <p>{item}</p>


                        <div className="audrec"><AudioRecorder
                            onRecordingComplete={async (blob) => {
                                // let data = new FormData();

                                // data.append('text', "this is the transcription of the audio file");
                                // // datas.append('wavfile', blob, "recording.wav");
                                // for (let pair of data.entries()) {
                                //     console.log(pair[0] + ', ' + pair[1]);
                                // }
                                // const config = {
                                //     headers: { 'content-type': 'multipart/form-data' }
                                // }
                                console.log("rec com")
                                const url = await URL.createObjectURL(blob);
                                console.log(key)
                                let qExists = answers.some(obj => obj.q === ques[imp]);
                                if (!qExists) {
                                    await setAnswers([...answers, { question: ques[imp], answer: transcript, category: f, audio: url }])
                                }
                                setDisabled([...disabled, imp])

                                // axios.post('http://localhost:4000/asr', { url: url }).catch(function (error) {
                                //     console.log(error);
                                // });;


                            }}
                            recorderControls={recorderControls}
                            // downloadOnSavePress={true}
                            // downloadFileExtension="mp3"
                            showVisualizer={true}
                        /></div>

                        <div className="btn-style">


                            <button className={disabled.includes(key) ? 'audioBtn disabled' : 'audioBtn'} onClick={!disabled.includes(key) ? startListening : undefined}>Start Listening</button>
                            <button className={disabled.includes(key) ? 'audioBtn disabled' : 'audioBtn'} onClick={!disabled.includes(key) ? () => stopListening(key) : undefined} >Stop Listening</button>

                        </div>

                    </div>
                )}
            </div>
            <div>
                <button className={'subBtn'} onClick={submitAnswers}>Submit</button>
            </div>


        </div>
    )
}

export default Questions