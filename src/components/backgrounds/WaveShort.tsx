export default function WaveShort() {
  return (
    <div className="absolute top-0 z-[-1] w-full">
      <div
        className="absolute top-[-100px] min-h-[600px] w-full"
        style={{
          background: "linear-gradient(180deg, #4316db 0%, #9076e7 100%)",
        }}
      />
      <img
        src="/images/waves/hero-wave3.svg"
        alt="Short Wave"
        className="hero-wave3 absolute top-[200px] w-full"
      />
    </div>
  );
}