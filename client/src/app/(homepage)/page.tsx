import Hero from './Hero'
import Strip from './Strip'
import Category from './Category'
import Publisher from './Publisher'
import Podcast from './Podcast'
import Testimonials from './Testimonials'
import Footer from './Footer'

const page = () => {
  return (
    <div>
        <Hero/>
        <Strip/>
        <Category/>
        <Publisher/>
        <Podcast/>
        <Testimonials/>
        <Footer/>
    </div>
  )
}

export default page
