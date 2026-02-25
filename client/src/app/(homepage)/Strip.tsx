import {
  publication,
  authorSpotlight,
  publisherShowcase,
  podcast,
} from "@/public/images/index";
import Image from "next/image";

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
      <div className="strip-card flex gap-3 m-auto w-[90%] justify-center items-center py-12">
        {
            stripData?.map(item=>(
                <div className={`card-item flex items-center justify-center ${item.border ? "border-r border-white" : ""}`} key={item.id}>
                    <Image src={item.img} alt=""/>
                    <div className="px-2 ">
                        <p className="text-secondary font-semibold text-xl">{item.title}</p>
                        <p className="w-[70%] font-rouge text-2xl font-medium text-white">{item.desc}</p>
                    </div>
                </div>
            ))
        }
      </div>
    </div>
  );
};

export default Strip;
