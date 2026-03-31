import Image from "next/image";
import { BiEdit } from "react-icons/bi";

interface UserDetailsProps {
  role?: 'author' | 'reader';
  profileImageUrl?: string;
}

const UserDetails = ({ role = 'author', profileImageUrl }: UserDetailsProps) => {
  const defaultImages = {
    author: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    reader: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"
  };

  const src = profileImageUrl || defaultImages[role] || defaultImages.author;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 w-full max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full md:w-auto">
        {/* Profile Image */}
        <div className="group cursor-pointer relative w-[160px] md:w-[200px] shrink-0 aspect-square overflow-hidden rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-4 ring-offset-4 ring-outline-variant/10 transition-transform duration-500 hover:scale-[1.02]">
          <Image
            src={src}
            alt="profile picture"
            width={300}
            height={300}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/20 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
            <BiEdit className="text-3xl text-white drop-shadow-md" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-center max-w-2xl text-center md:text-left mt-4 md:mt-2">
          <h1 className="text-4xl md:text-[2.75rem] font-bold tracking-tight text-primary mb-4 leading-none">
            Manas Manthan Rout
          </h1>
          <p className="text-base md:text-[17px] text-on-surface-variant opacity-80 font-serif italic leading-relaxed mb-10 md:border-l-2 md:border-primary/20 md:pl-5 mx-auto md:mx-0 max-w-lg">
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ea quae autem atque nemo quidem dolorum, totam in ratione sed molestias."
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-14">
            {[
              { label: 'Books', value: '128' },
              { label: 'Blogs', value: '24' },
              { label: 'Followers', value: '1.2k' },
              { label: 'Following', value: '200' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[2rem] leading-none font-bold text-primary group-hover:text-tertiary transition-colors duration-300">
                  {stat.value}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-on-surface-variant/70 mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full md:w-auto mt-6 md:mt-4 items-center justify-center md:justify-end shrink-0">
        <button className="px-8 py-3 bg-primary text-white font-semibold text-[11px] tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:-translate-y-0.5">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
