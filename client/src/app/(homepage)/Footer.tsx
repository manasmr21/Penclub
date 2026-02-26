const Footer = () => {
  return (
    <footer className="section-footer bg-primary">
      <div className="curtain main-container">
        <div className="text-white 
          flex flex-col 
          md:flex-row 
          md:flex-wrap 
          justify-between 
          gap-10 
          px-6 sm:px-10 lg:px-16 
          py-12">

          {/* Column 1 */}
          <div className="flex-1 min-w-[220px] text-center md:text-left">
            <h1 className="text-secondary mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-inter">
              Penclub
            </h1>
            <p className="font-semibold w-[70%] m-auto md:m-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Doloremque architecto vel et debitis rerum maxime!
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex-1 min-w-[180px] text-center md:text-left">
            <h1 className="text-secondary mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-inter">
              Quick Links
            </h1>
            <ul className="font-semibold space-y-2">
              <li className="cursor-pointer hover:underline w-max m-auto md:m-0 ">Home</li>
              <li className="cursor-pointer hover:underline w-max m-auto md:m-0 ">Magazine</li>
              <li className="cursor-pointer hover:underline w-max m-auto md:m-0 ">Podcast</li>
              <li className="cursor-pointer hover:underline w-max m-auto md:m-0 ">Books</li>
              <li className="cursor-pointer hover:underline w-max m-auto md:m-0 ">Events</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex-1 min-w-[200px] text-center md:text-left">
            <h1 className="text-secondary mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-inter">
              Location
            </h1>
            <div className="space-y-1 font-semibold">
              <p>Madanpur</p>
              <p>near Infovalley, Bhubaneswar,</p>
              <p>Odisha 752054</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;