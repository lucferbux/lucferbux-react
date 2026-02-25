import WaveFooter from "../backgrounds/WaveFooter";
import { footerData } from "../../data/footerData";
import NavButton from "../buttons/NavButton";
import NavButtonExternal from "../buttons/NavButtonExternal";

export default function Footer() {
  return (
    <div className="relative h-[440px] w-full pt-[250px] max-sm:top-[10px]">
      <WaveFooter />
      <div className="relative mx-auto grid max-w-[660px] grid-cols-[auto_auto] gap-x-10 px-5 max-[600px]:grid-cols-1 max-[600px]:justify-items-center">
        <div className="grid max-w-[340px] grid-cols-[144px_144px] gap-x-2">
          {footerData.map((item, index) =>
            item.external ? (
              <NavButtonExternal
                icon={item.icon}
                text={item.title}
                link={item.link}
                key={index}
              />
            ) : (
              <NavButton
                icon={item.icon}
                text={item.title}
                link={item.link}
                key={index}
              />
            )
          )}
        </div>
        <div className="h-[110px] max-w-[280px] py-16 text-[13px] text-white/70 max-[600px]:text-center">
          <p>This site does not track any information about usage</p>
        </div>
      </div>
    </div>
  );
}
