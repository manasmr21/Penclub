import PodcastCarousel from "@/src/components/Carousels/PodcastCarousel";

const Podcast = () => {
  return (
    <>
      <div className="section-podcast  bg-white">
        <div className="py-20 main-container">
          <h1 className="text-3xl font-bold text-primary text-center uppercase">
            podcasts
          </h1>
          <div className="mt-10">
            <PodcastCarousel />
          </div>
        </div>
      </div>
    </>
  );
};

export default Podcast;
