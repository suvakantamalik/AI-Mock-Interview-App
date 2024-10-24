"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAiModel'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
import moment from 'moment'

function RecordAnsSection(mockInterviewQuestion, activeQuestionIndex, interviewData) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    // console.log(interviewData)
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => {
            setUserAnswer(prevAns => prevAns + result?.transcript)
        })
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        }

    }, [userAnswer])

    const StartStopRecording = async () => {
        if (isRecording) {
            // setLoading(true);
            stopSpeechToText();

        }
        else {
            startSpeechToText();
        }
    }
    
    // console.log(interviewData)
    const UpdateUserAnswer = async () => {
        console.log(userAnswer, "########");
        setLoading(true);
        const feedBackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer: " + userAnswer + ", Depends on question and user answer for given interview question " +
            "please give us rating for answer and feedback as area of improovement if any " +
            "in just 3 to 5 lines to improoe it in JSON format with rating field and feedback field "

        const result = await chatSession.sendMessage(feedBackPrompt);

        const mockJsonResp = result.response.text().replace('```json', '').replace('```', '');
        console.log(mockJsonResp);
        const JsonfeedbackResp = JSON.parse(mockJsonResp);

        console.log('userAnswer:', userAnswer); // Check if `userAnswer` is defined
        console.log("interviewData?.mockId ")
        console.log(interviewData)

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: JsonfeedbackResp?.feedback,
            rating: JsonfeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
        });


        if (resp) {
            toast('User answer recorded successfully');
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoading(false);
    }


    //updated function

    // const UpdateUserAnswer = async () => {
    //     console.log(userAnswer, "########");
    //     setLoading(true);
        
    //     const feedBackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
    //         ", User Answer: " + userAnswer + ", Depends on question and user answer for given interview question " +
    //         "please give us rating for answer and feedback as area of improovement if any " +
    //         "in just 3 to 5 lines to improoe it in JSON format with rating field and feedback field "
    
    //     try {
    //         const result = await chatSession.sendMessage(feedBackPrompt);
    
    //         // Sanitize the result, remove non-JSON artifacts like ```json or ```
    //         const mockJsonResp = result.response.text().replace(/```json|```/g, '');
    //         console.log(mockJsonResp);
    
    //         // Try to parse the JSON response, and catch any parsing errors
    //         const JsonfeedbackResp = JSON.parse(mockJsonResp);
    
    //         console.log('Parsed JSON feedback:', JsonfeedbackResp);
    
    //         // Proceed with saving to the database
    //         const resp = await db.insert(UserAnswer).values({
    //             mockIdRef: interviewData?.mockId,
    //             question: mockInterviewQuestion[activeQuestionIndex]?.question,
    //             correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
    //             userAns: userAnswer,
    //             feedback: JsonfeedbackResp?.feedback,
    //             rating: JsonfeedbackResp?.rating,
    //             userEmail: user?.primaryEmailAddress?.emailAddress,
    //             createdAt: moment().format("DD-MM-YYYY"),
    //         });
    
    //         if (resp) {
    //             toast('User answer recorded successfully');
    //             setUserAnswer(''); // Reset the answer field
    //             setResults([]); // Clear results
    //         }
    
    //     } catch (error) {
    //         console.error("Error parsing JSON or saving to DB:", error);
    //         toast.error('There was an issue recording the answer');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col justify-center items-center mt-20 bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200} alt="webcam"
                    className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10
                    }}
                />
            </div>

            <Button
                disabled={loading}
                variant="outline" className='my-10'
                onClick={StartStopRecording}
            >
                {isRecording ?
                    <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                        <StopCircle />Stop Recording
                    </h2>
                    :
                    <h2 className='text-purple-700 flex gap-2 items-center'>
                        <Mic />Record Answer
                    </h2>}
            </Button>


            <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>

            {/* <h1>Recording: {isRecording.toString()}</h1>
            <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <ul>
                {results.map((result) => (
                    <li key={result.timestamp}>{result.transcript}</li>
                ))}
                {interimResult && <li>{interimResult}</li>}
            </ul> */}
        </div>
    )
}

export default RecordAnsSection