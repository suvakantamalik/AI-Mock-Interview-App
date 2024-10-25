"use client"
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { index } from 'drizzle-orm/mysql-core'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'



function Feedback({ params }) {

  const [feedbackList, setFeedbackList] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const router = useRouter()


  useEffect(() => {
    GetFeedback()
  }, [])

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  useEffect(() => {
    // if (feedbackList?.length > 0) {
    //   calculateAverageRating();
    // }
    const calculateAverageRatingAsync = async () => {
      await calculateAverageRating(feedbackList)
    }
    calculateAverageRatingAsync(feedbackList)
  }, [feedbackList]);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp)

    console.log(jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
  }

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id)

    // console.log(result)
    setFeedbackList(result)
  }

  const calculateAverageRating = (feedbackList) => {
    if (feedbackList.length === 0) {
      setAverageRating(0)
      return
    }

    const total = feedbackList.reduce((acc, item) => acc + parseInt(item.rating), 0)
    // setAverageRating((total / feedbackList.length).toFixed(1)) // rounds to one decimal place
    setAverageRating((total / 5).toFixed(1))
  }

  return (
    <div className='p-10'>


      {feedbackList?.length == 0 ?
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
        :
        <div>
          <h2 className='text-3xl font-bold text-green-500'>Congratulation!🎉</h2>
          <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
          <h2 className='text-purple-700 text-lg my-3'>Your overal interview rating: <strong>{averageRating}/10</strong></h2>

          <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>
          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
                {item.question} <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
                  <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
                  <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                  <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-purple-900'><strong>Feedback: </strong>{item.feedback}</h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {mockInterviewQuestion.filter(mock => !feedbackList.some(feedback => feedback.question === mock.question ))
          .map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
                {item.question} <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>N/A</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Not Attempted</strong></h2>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>}
      <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback