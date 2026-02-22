export default function WaveHero() {
  return (
    <div className="absolute top-0 z-[-1] w-full">
      <div
        className="absolute top-[-100px] min-h-[800px] w-full"
        style={{
          background: "linear-gradient(180deg, #4316db 0%, #9076e7 100%)",
        }}
      />
      <img
        src="/images/backgrounds/stars.svg"
        alt="Stars Background"
        className="absolute top-0 hidden w-full dark:block"
      />
      <img
        src="/images/waves/hero-wave1.svg"
        alt="Hero Wave 1"
        className="absolute top-[350px] w-full"
      />
      <img
        src="/images/waves/hero-wave2.svg"
        alt="Hero Wave 2"
        className="absolute top-[450px] w-full opacity-20"
      />
      <img
        src="/images/waves/hero-wave3.svg"
        alt="Hero Wave 3"
        className="hero-wave3 absolute top-[500px] w-full"
      />
    </div>
  );
}
