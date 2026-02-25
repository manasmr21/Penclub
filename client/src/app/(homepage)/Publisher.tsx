import PublisherCarousel from '@/src/components/Carousels/PublisherCarousel'
import React from 'react'

const Publisher = () => {
  return (
    <>
        <div className='section-publisher py-20 bg-white'>
            <div>
                <h1 className='uppercase publisher-heading  text-center text-3xl font-semibold text-primary'>
                    <span className='relative font-bold'>Publishers</span>
                </h1>
                <PublisherCarousel/>
            </div>
        </div> 
    </>
  )
}

export default Publisher
