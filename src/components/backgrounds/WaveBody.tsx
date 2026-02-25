export default function WaveBody() {
  return (
    <div className="relative">
      <div className="absolute -z-10 h-[1500px] w-full overflow-hidden">
        {/* Background gradient — teal light, dark-teal dark */}
        <div
          className="body-gradient absolute h-[800px] w-full"
          style={{
            background:
              "linear-gradient(180deg, rgb(0, 119, 137) 13.57%, rgb(176, 196, 199) 98.38%)",
          }}
        />
        {/* Stars overlay — dark mode only */}
        <div className="absolute top-0 hidden h-[420px] w-full bg-[url('/images/backgrounds/stars.svg')] bg-[position:center_top] bg-repeat dark:block" />
        {/* Bottom wave */}
        <img
          src="/images/waves/hero-wave3.svg"
          alt="Body Wave"
          className="hero-wave3 absolute top-[400px] max-w-none 3xl:w-full"
        />
      </div>
    </div>
  );
}