import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function LoginPage() {
    return (
        <div className='w-full h-screen flex justify-center py-16'>
            <SignIn />
        </div>
    )
}
