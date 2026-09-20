import WaveFooter from "../backgrounds/WaveFooter";
import { footerData } from "../../data/footerData";
import NavButton from "../buttons/NavButton";
import NavButtonExternal from "../buttons/NavButtonExternal";
import { useTranslation } from "../../i18n/LanguageContext";
import { useLocalePath } from "../../i18n/useLocalePath";
import LanguageToggle from "../buttons/LanguageToggle";

export default function Footer() {
  const { m } = useTranslation();
  const localePath = useLocalePath();

  return (
    <div className="relative h-[440px] w-full pt-[250px] max-sm:top-[10px]">
      <WaveFooter />
      <div className="relative mx-auto grid max-w-[660px] grid-cols-[auto_auto] gap-x-10 px-5 max-[600px]:grid-cols-1 max-[600px]:justify-items-center">
        <div className="grid max-w-[340px] grid-cols-[144px_144px] gap-x-2">
          {footerData.map((item, index) =>
            item.external ? (
              <NavButtonExternal
                icon={item.icon}
                text={m.nav[item.labelKey]}
                link={item.link}
                key={index}
              />
            ) : (
              <NavButton
                icon={item.icon}
                text={m.nav[item.labelKey]}
                link={localePath(item.link)}
                key={index}
              />
            )
          )}
        </div>
        {/* `py-16` with the old fixed `h-[110px]` left negative content
            height, which collapsed anything placed above the notice. */}
        <div className="grid max-w-[280px] content-start gap-4 pt-14 pb-4 text-[13px] text-white/70 max-[600px]:justify-items-center max-[600px]:pt-8 max-[600px]:text-center">
          <LanguageToggle className="w-fit" />
          <p>{m.footer.privacyNotice}</p>
        </div>
      </div>
    </div>
  );
}
