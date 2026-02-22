export default function WaveHero() {
  return (
    <div className="relative">
      {/* Background gradient — z:-10 (furthest back) */}
      <div
        className="hero-gradient absolute -z-10 h-[800px] w-full"
        style={{
          background: "linear-gradient(180deg, #c98c31 0%, #eabe7d 100%)",
        }}
      />
      {/* Stars overlay — dark mode only */}
      <div className="absolute top-[10px] hidden h-[224px] w-full bg-[url('/images/backgrounds/stars.svg')] bg-[position:center_top] bg-repeat dark:block" />
      {/* Wave 1 — z:-1, natural width below 1440px */}
      <img
        src="/images/waves/hero-wave1.svg"
        alt="Hero Wave 1"
        className="absolute top-[140px] -z-1 3xl:w-full"
      />
      {/* Backdrop blur between gradient and upper waves — z:-1 */}
      <div className="absolute -z-1 h-[800px] w-full backdrop-blur-[60px]" />
      {/* Wave 2 — z:0, semi-transparent, natural width below 1440px */}
      <img
        src="/images/waves/hero-wave2.svg"
        alt="Hero Wave 2"
        className="absolute top-[350px] z-0 opacity-20 3xl:w-full"
      />
      {/* Wave 3 — z:0, dark mode swap via CSS, natural width below 1440px */}
      <img
        src="/images/waves/hero-wave3.svg"
        alt="Hero Wave 3"
        className="hero-wave3 absolute top-[550px] z-0 3xl:w-full"
      />
    </div>
  );
}
