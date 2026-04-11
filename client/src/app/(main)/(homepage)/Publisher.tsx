import PublisherCarousel from '@/src/components/Carousels/PublisherCarousel'
import React from 'react'

const Publisher = () => {
  return (
    <>
        <div className='section-publisher py-12 lg:py-20 bg-white'>
            <div>
                <h1 className='uppercase publisher-heading  text-center text-3xl font-semibold text-primary'>
                    <span className='relative font-bold'>Publishers</span>
                </h1>
                <div className='mt-10'>
                    <PublisherCarousel/>
                </div>
            </div>
        </div> 
    </>
  )
}

export default Publisher
