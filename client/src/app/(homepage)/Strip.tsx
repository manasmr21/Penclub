import {
  publication,
  authorSpotlight,
  publisherShowcase,
  podcast,
} from "@/public/images/index";
import Image from "next/image";
import "./Hero.css"

const stripData = [
    {
        id: 1,
        img: publication,
        title: "New Publications",
        desc: "Discover new books, every day",
        border: true
    },
    {
        id: 2,
        img: authorSpotlight,
        title: "Author Spotlight",
        desc: "Meet the minds behind the words",
        border: true
    },
    {
        id: 3,
        img: publisherShowcase,
        title: "Publisher Showcase",
        desc: "A platform for publishers to shine",
        border: true
    },
    {
        id: 4,
        img: podcast,
        title: "Podcast",
        desc: "Stories beyond the pages.",
        border: false
    }
]

const Strip = () => {
  return (
    <div className="section-strip bg-primary">
      <div className="strip-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-[90%] m-auto place-items-start py-2">
        {stripData?.map((item) => (
          <div
            key={item.id}
            className={`card-item flex items-center justify-center px-6 py-4 ${
              item.border ? "lg:border-r border-white" : ""
            }`}
          >
            <Image src={item.img} alt="" />
            <div className="px-3">
              <p className="text-secondary font-semibold text-xl">
                {item.title}
              </p>
              <p className="w-[70%] font-rouge text-2xl font-medium text-white">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strip;
