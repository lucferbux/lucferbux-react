export default function WaveShort() {
  return (
    <div className="relative">
      <div className="absolute -z-10 h-[1500px] w-full overflow-hidden">
        {/* Background gradient — teal light, dark-teal dark */}
        <div
          className="short-gradient absolute h-[400px] w-full"
          style={{
            background:
              "linear-gradient(189.16deg, rgb(0, 119, 137) 13.57%, rgb(176, 196, 199) 98.38%)",
          }}
        />
        {/* Bottom wave */}
        <img
          src="/images/waves/hero-wave3.svg"
          alt="Short Wave"
          className="hero-wave3 absolute top-[225px] -z-1 3xl:w-full"
        />
      </div>
    </div>
  );
}