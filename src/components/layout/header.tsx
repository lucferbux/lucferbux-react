import { Link } from "react-router-dom";
import { menuData } from "../../data/menuData";
import NavButton from "../buttons/NavButton";

export default function Header() {
  return (
    <div className="absolute left-0 right-0 z-50 mx-auto flex h-11 max-w-[1234px] items-center justify-between px-[30px] py-10 max-xs:top-[10px] max-xs:px-5 max-xs:py-5">
      <Link to="/">
        <img src="/images/logos/logo.svg" alt="Logo Icon" />
      </Link>
      <div
        className="grid gap-[30px]"
        style={{ gridTemplateColumns: `repeat(${menuData.length}, auto)` }}
      >
        {menuData.map((item, index) => (
          <NavButton
            icon={item.icon}
            text={item.title}
            link={item.link}
            key={index}
            collapse
          />
        ))}
      </div>
    </div>
  );
}