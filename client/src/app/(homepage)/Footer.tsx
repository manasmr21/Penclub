const Footer = () => {
  return (
    <footer className="section-footer">
      <div className="curtain bg-[#faf8e3d8]">
        <div className="flex justify-between px-5 py-12 gap-5">
          <div className=" flex-1">
            <h1 className=" mb-3 text-primary text-4xl font-bold font-inter text-left">
              Penclub
            </h1>
            <p className="font-semibold w-[50%] ml-3">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Doloremque architecto vel et debitis rerum maxime!
            </p>
          </div>
          <div className=" flex-1">
            <h1 className=" mb-3 text-primary text-4xl font-bold font-inter text-left">
              Quick Links
            </h1>
            <ul className="font-semibold ml-3">
              <li>Home</li>
              <li>Magazine</li>
              <li>Podcast</li>
              <li>Books</li>
              <li>Events</li>
            </ul>
          </div>
          <div className=" flex-1">
            <h1 className=" mb-3 text-primary text-4xl font-bold font-inter text-left">
              Location
            </h1>
            <div className="ml-3">
              <p className="font-semibold">Madanpur</p>
              <p className="font-semibold">near Infovalley, Bhubaneswar,</p>
              <p className="font-semibold">Odisha 752054</p>
            </div>
          </div>
        </div>
        <div className="credits w-full border-t-2 border-black">
          <p className="font-bold text-center">
            Designed and developed by: Dzinepixel Webstudios
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
