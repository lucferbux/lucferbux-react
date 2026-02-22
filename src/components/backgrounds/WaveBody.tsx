export default function WaveBody() {
  return (
    <div className="absolute top-0 z-[-1] w-full">
      <div
        className="absolute top-0 min-h-[800px] w-full"
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
        src="/images/waves/hero-wave3.svg"
        alt="Body Wave"
        className="hero-wave3 absolute top-[200px] w-full"
      />
    </div>
  );
}