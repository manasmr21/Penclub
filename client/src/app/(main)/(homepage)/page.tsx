import Hero from './Hero'
import Strip from './Strip'
import Category from './Category'
import Publisher from './Publisher'
import Podcast from './Podcast'
import Testimonials from './Testimonials'



const page = () => {
  return (
    <div>
        <Hero/>
        <Category/>
        <Publisher/>
        <Podcast/>
        <Testimonials/>
    </div>
  )
}

export default page
