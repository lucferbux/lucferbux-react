import { Link } from "react-router-dom";

interface FlatButtonLinkProps {
  icon: string;
  text: string;
  link: string;
}

export default function FlatButtonLink({ icon, text, link }: FlatButtonLinkProps) {
  return (
    <Link to={link}>
      <button
        className="group flex cursor-pointer items-center rounded-[30px] border-none py-2.5 pr-[30px] pl-3 transition-all duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(180deg, rgba(141,141,145,0.6) 0%, rgba(129,129,129,0.45) 100%)',
          boxShadow: 'rgba(0,0,0,0.15) 0px 20px 40px, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset',
        }}
      >
        <img
          src={`/images/icons/${icon}.svg`}
          className="transition-transform duration-600 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:scale-110"
          alt="Logo Social Button"
        />
        <span className="my-auto mr-auto ml-2 text-[15px] font-medium leading-[18px] text-white">
          {text}
        </span>
      </button>
    </Link>
  );
}
