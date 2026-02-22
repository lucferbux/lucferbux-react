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
      className="news-card-detail-gradient group relative grid h-[360px] w-[280px] cursor-pointer overflow-hidden rounded-[20px] transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02] max-xs:w-[260px]"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[20px]">
        <img
          src={post.image}
          alt="Post Image"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover blur-[2px] transition-transform duration-800 group-hover:scale-110 ${loaded ? "block" : "hidden"}`}
        />
        <img
          src="/images/animations/loading.gif"
          alt="Post Loading"
          className={`h-full w-full object-cover ${!loaded ? "block" : "hidden"}`}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
      <div className="relative z-10 flex flex-col justify-end gap-2 p-5">
        <p className="text-[24px] font-bold leading-[26px] text-white">{post.title_en}</p>
        <p className="line-clamp-3 text-[15px] leading-[130%] text-white/80">
          {post.description_en}
        </p>
      </div>
    </div>
  );

  if (post.internalLink) {
    return <Link to={`/blog/${post.internalLink}`}>{cardContent}</Link>;
  }

  return (
    <a href={post.link} target="_blank" rel="noopener">
      {cardContent}
    </a>
  );
}
