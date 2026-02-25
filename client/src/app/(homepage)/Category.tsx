import { categoryBG } from "@/public/images"
import CategoryCarousel from "@/src/components/Carousels/CategoryCarousel"

const Category = () => {
  return (
    <div className="section-category py-20" style={{background: `url(${categoryBG.src}) no-repeat center/cover`}}>
     <h1 className="uppercase text-3xl font-semibold text-center text-white">category</h1>
     <p className="text-center font-medium text-lg text-white">Explore a wide range of book categories curated for every kind of reader.</p>
     <CategoryCarousel/>
    </div>
  )
}

export default Category
