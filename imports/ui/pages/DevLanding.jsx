import React from 'react'
import Hello from '../components/DevLandingPage/Hello'
import Info from '../components/DevLandingPage/Info'
import ThemeToggle from '../components/DevLandingPage/ThemeToggle'
import { useNavigate } from 'react-router-dom'
import { PAGES } from '../constants/devLanding'



const DevLanding = () => {

    const nav = useNavigate();

    const handleClick = (route) => {
        nav(route)
    }


    return (
        <div className='px-8 py-10'>
            <Hello />
            <Info />
            <ThemeToggle />
            <div>
                <h1 className='text-4xl font-medium pt-3'>
                    Quick Page Access
                </h1>
                
                <div className='pt-5'>
                {PAGES.map((page) => (
                    <button 
                    key={page.id}
                    className='btn btn-primary mx-1' 
                    onClick={() => handleClick(page.route)}>
                        {page.name}
                    </button>
                ))}
                </div>

            </div>

        </div>
    )
}

export default DevLanding