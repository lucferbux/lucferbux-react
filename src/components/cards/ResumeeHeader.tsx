import { ExternalLink } from "../../data/model/externalLink";
import ResumeeButton from "../buttons/ResumeeButton";

interface ResumeeHeaderProps {
  title: string;
  caption: string;
  description: string;
  buttons: ExternalLink[];
}

export default function ResumeeHeader({
  title,
  caption,
  description,
  buttons,
}: ResumeeHeaderProps) {
  return (
    // A flat gradient swatch before. It now reads as a tile raised out of the
    // glass: a radius in the same family as the card's 24px, the same specular
    // top edge the panels use, and a shadow to separate it from the surface it
    // sits on.
    <div
      className="resumee-header-gradient relative h-[360px] w-[240px] overflow-hidden rounded-[16px] pt-[60px] max-md:h-auto max-md:w-full max-md:p-4"
      style={{
        background:
          "linear-gradient(200.42deg, #EABE7D 13.57%, #C98C31 98.35%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 28px -12px rgba(9,30,42,0.5)",
      }}
    >
      <div className="mx-auto grid w-[200px] gap-2.5 text-center">
        <img
          src="/images/avatars/avatar-lucas.png"
          alt="Profile Avatar"
          className="motion-glass mx-auto h-[88px] w-[88px] rounded-full ring-2 ring-white/40 group-hover:scale-[1.04] group-hover:ring-white/70"
        />
        <p className="m-0 text-[24px] font-bold leading-[29px] text-white">
          {title}
        </p>
        <p className="m-0 text-[13px] font-semibold uppercase leading-[130%] text-white/70">
          {caption}
        </p>
        <p className="m-0 line-clamp-2 text-[13px] font-normal leading-[130%] text-white/70">
          {description}
        </p>
      </div>
      <div
        className="relative mx-auto mt-5 grid w-full justify-center gap-x-6"
        style={{ gridTemplateColumns: `repeat(${buttons.length}, auto)` }}
      >
        {buttons.map((button, index) => (
          <ResumeeButton icon={button.image} link={button.link} key={index} />
        ))}
      </div>
    </div>
  );
}
