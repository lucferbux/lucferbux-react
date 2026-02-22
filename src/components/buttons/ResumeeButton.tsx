interface ResumeeButtonProps {
  icon: string;
  link: string;
}

export default function ResumeeButton({ icon, link }: ResumeeButtonProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener"
      className="group grid h-8 w-8 place-content-center rounded-[30px] bg-black/20 transition-all duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-120 hover:bg-black/30 active:scale-110 active:bg-black/25"
    >
      <img
        src={`/images/icons/${icon}.svg`}
        className="h-7 w-7 cursor-pointer border-none p-1"
        alt="Logo Resumee Button"
      />
    </a>
  );
}
