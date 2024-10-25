"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

    const router = useRouter()

    const path = usePathname();

    useEffect(() => {
        // console.log(path);
    },[])

    const upgradePage = () => {
      // Redirect to upgrade page
      router.push('/dashboard/upgrade')
    }

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={'/logo.svg'} width={160} height={100} alt="log"/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/dashboard'&&'text-primary font-bold'}
            `}      
            onClick={() => router.replace('/dashboard')}      
            >Dashboard</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/dashboard/questions'&&'text-primary font-bold'}
            `}
            >Questions</li>
            
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/dashboard/upgrade'&&'text-primary font-bold'}
            `}
            onClick={upgradePage}
            >Upgrade</li>

            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/dashboard/how'&&'text-primary font-bold'}
            `}
            >How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header