import { useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../../data/model/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [loaded, setLoaded] = useState(false);

  const cardContent = (
    <div
      className="group relative min-w-[200px] max-w-[500px] animate-[fadein_0.4s] overflow-hidden rounded-xl text-black dark:text-white"
      style={{
        boxShadow: "rgb(24 32 79 / 25%) 0px 40px 80px",
      }}
    >
      {/* Background image — no resize on hover, blur(4px) matching old */}
      <div className="w-full transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)]">
        <img
          src={post.image}
          alt="Post Image"
          onLoad={() => setLoaded(true)}
          className={`m-0 w-full rounded-xl blur-[4px] ${loaded ? "block" : "hidden"}`}
        />
        <img
          src="/images/animations/loading.gif"
          alt="Post Loading"
          className={`m-0 w-full rounded-xl ${!loaded ? "block" : "hidden"}`}
        />
      </div>

      {/* Overlay matching old ::after — light mode: rgba(206,206,206,0.6), dark: rgba(0,0,0,0.6) */}
      <div className="absolute inset-0 rounded-xl bg-[rgb(206_206_206/60%)] shadow-[inset_0_0_0_1px_rgb(255_255_255/50%)] dark:bg-[rgba(0,0,0,0.6)]" />

      {/* Title — positioned at top */}
      <h3 className="absolute top-[30px] left-0 z-[3] mx-5 break-words text-[30px] font-bold max-[520px]:top-5 max-[520px]:text-[20px] max-[350px]:top-3 max-[350px]:text-[16px]">
        {post.title_en}
      </h3>

      {/* Description — positioned at bottom */}
      <p className="absolute bottom-[30px] left-0 z-[3] mx-5 break-words text-[17px] font-medium leading-[130%] max-[520px]:bottom-5 max-[520px]:max-h-[70px] max-[520px]:overflow-y-scroll max-[520px]:text-[12px] max-[350px]:bottom-3 max-[350px]:max-h-[48px] [&::-webkit-scrollbar]:hidden">
        {post.description_en}
      </p>
    </div>
  );

  if (post.internalLink) {
    return (
      <Link
        to={`/blog/${post.internalLink}`}
        className="relative cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener"
      className="relative cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
    >
      {cardContent}
    </a>
  );
}
