interface SocialButtonProps {
  icon: string;
  link: string;
}

export default function SocialButton({ icon, link }: SocialButtonProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener"
      className="social-btn group grid max-w-[78px] h-[78px] grid-cols-[53px] items-center justify-center rounded-[20px] border-0 p-3 transition-all duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:-translate-y-[3px] active:-translate-y-[1px]"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #FFFBD9 100%)',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 20px 40px rgba(102,61,0,0.2), inset 0px 0px 0px 0.5px rgba(255,255,255,0.5)',
      }}
    >
      <div
        className="relative ml-1 grid h-[45px] w-[45px] place-content-center rounded-full transition-[filter] duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:hue-rotate-[18deg] group-active:hue-rotate-[3deg]"
        style={{ background: 'linear-gradient(200.44deg, #c98c31 13.57%, #eabe7d 98.38%)' }}
      >
        <img
          src={`/images/icons/${icon}.svg`}
          className="h-[29px] w-[29px] transition-transform duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:scale-120 group-active:scale-110"
          alt="Logo Social Button"
        />
        <img
          src="/images/icons/icon-ring.svg"
          alt="Decorative Ring"
          className="absolute -top-[5px] -left-[5px] transition-transform duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:rotate-[30deg] group-hover:scale-120 group-active:rotate-[10deg] group-active:scale-110"
        />
      </div>
    </a>
  );
}