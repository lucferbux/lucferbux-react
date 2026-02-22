export default function WaveFooter() {
  return (
    <div className="absolute top-0 h-[600px] w-full overflow-hidden">
      {/* Background fill */}
      <div className="absolute top-[200px] h-[900px] w-full bg-[#1B2E2D] 3xl:top-[600px]" />
      {/* Wave 1 */}
      <img
        src="/images/waves/footer-wave1.svg"
        alt="Background wave 1"
        className="absolute top-[100px] -z-1 w-full overflow-hidden"
      />
      {/* Wave 2 — dark mode variant handled via CSS content swap */}
      <img
        src="/images/waves/footer-wave2.svg"
        alt="Background wave 2"
        className="footer-wave2 absolute top-[70px] left-[40px] -z-2 w-full scale-[1.2] overflow-hidden max-xs:left-0 max-xs:top-[80px] max-xs:scale-100"
      />
    </div>
  );
}
