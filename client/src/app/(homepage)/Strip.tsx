import {
  publication,
  authorSpotlight,
  publisherShowcase,
  podcast,
  podcastSvg,
  writting,
  spotlight,
  publicationSvg,
} from "@/public/images/index";
import Image from "next/image";

const stripData = [
  {
    id: 1,
    img: publicationSvg,
    title: "New Publications",
    desc: "Discover new books, every day",
    border: true,
  },
  {
    id: 2,
    img: spotlight,
    title: "Author Spotlight",
    desc: "Meet the minds behind the words",
    border: true,
  },
  {
    id: 3,
    img: writting,
    title: "Publisher Showcase",
    desc: "A platform for publishers to shine",
    border: true,
  },
  {
    id: 4,
    img: podcastSvg,
    title: "Podcast",
    desc: "Stories beyond the pages.",
    border: false,
  },
];

const Strip = () => {
  return (
    <div className="section-strip bg-primary ">
      <div className="strip-card main-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-[90%] m-auto place-items-start py-2">
        {stripData?.map((item) => (
          <div
            key={item.id}
            className={`group card-item flex items-center justify-center px-6 py-4  ${
              item.border ? "lg:border-r border-white" : ""
            }`}
          >
            <div className="border-8 border-transparent group-hover:border-[#1e5bb7] duration-300 rounded-full">
              <div className="flex items-center justify-center w-18 h-18 rounded-full bg-[#faffba]">
                <Image
                  src={item.img}
                  alt=""
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="px-3">
              <p className="text-secondary font-semibold text-xl">
                {item.title}
              </p>
              <p className="w-full font-gveret text-md font-medium text-white">
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
