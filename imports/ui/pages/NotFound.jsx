import React from 'react'
import { Link } from 'react-router-dom'
import { NOTFOUND } from './general'

const NotFound = () => {
    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100 ">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 ">
                        {NOTFOUND.error404}
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-800 md:text-4xl ">
                        {NOTFOUND.l1}
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-700">
                        {NOTFOUND.l2}
                    </p>
                    <Link to='/dashboard'>
                        <button className='px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition'>
                            {NOTFOUND.textBtn}
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default NotFound
