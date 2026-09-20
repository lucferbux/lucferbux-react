import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import InfoBox from "../text/infoBox";
import { Post } from "../../data/model/post";
import { Project } from "../../data/model/project";
import ProjectCard from "../cards/ProjectCard";
import WavePostHome from "../backgrounds/WavePostHome";
import Tilt from "react-parallax-tilt";
import PostCard from "../cards/PostCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";

export default function PostsProjectSection() {
  const { m } = useTranslation();
  const infoProject = m.sections.projectsHome;
  const infoPosts = m.sections.postsHome;
  const {
    data: projects,
    loading: projLoading,
    error: projError,
  } = useFirestoreCollection<Project>("project", {
    where: [["featured", "==", true]],
    // Without an orderBy Firestore returns arbitrary featured projects.
    orderBy: [["date", "desc"]],
    limit: 2,
  });

  const {
    data: posts,
    loading: postLoading,
    error: postError,
  } = useFirestoreCollection<Post>("patent", {
    orderBy: [["date", "desc"]],
    limit: 1,
  });

  if (projLoading || postLoading) return <LoadingSpinner />;
  if (projError || postError)
    return <ErrorFallback message="Failed to load projects or posts" />;

  return (
    <div className="relative h-[1150px] overflow-hidden pt-[5px] max-xl:h-[1420px] max-md:h-[1700px]">
      <WavePostHome />
      <img
        src="/images/waves/postproject-wave5.svg"
        alt=""
        className="postproject-wave5 absolute -bottom-[10px] z-[-1] hidden 3xl:block 3xl:w-full"
      />

      {/* Projects row */}
      <div className="mx-auto mt-[100px] mb-5 grid max-w-[1234px] grid-cols-[360px_auto] justify-between px-[30px] py-5 max-xl:mt-[120px] max-xl:block max-xl:px-0 max-xl:py-5 max-xl:text-center xl:py-10 min-[1950px]:py-[60px] min-[2600px]:py-[80px]">
        <div className="max-xl:grid max-xl:justify-items-center">
          <InfoBox
            title={infoProject.title}
            description={infoProject.description}
            displayButton={true}
            darkColor={true}
            iconButton="code"
            textButton={infoProject.button}
            linkButton="projects"
          />
        </div>
        <div className="relative -top-10 grid grid-cols-[repeat(auto-fit,280px)] justify-items-center gap-[30px] max-w-[1234px] px-5 py-10 max-xl:grid-cols-[auto_auto] max-xl:overflow-x-scroll max-xl:justify-items-center max-xl:pb-[150px] max-xl:[&::-webkit-scrollbar]:hidden max-md:grid-cols-1 max-md:overflow-x-visible max-md:pb-10 max-[640px]:justify-start">
          {projects?.map((projectEntry, index) => (
            <ProjectCard
              project={projectEntry}
              captionText="FEATURED"
              key={index}
            />
          ))}
        </div>
      </div>

      {/* Posts row */}
      <div className="mx-auto grid max-w-[1234px] grid-cols-[360px_auto] justify-between px-[30px] py-5 [direction:rtl] max-xl:relative max-xl:-top-[150px] max-xl:block max-xl:px-0 max-xl:py-5 max-xl:text-center xl:py-10 max-md:top-0">
        <div className="px-5 [direction:ltr] max-xl:grid max-xl:justify-items-center">
          <InfoBox
            title={infoPosts.title}
            description={infoPosts.description}
            displayButton={true}
            darkColor={true}
            iconButton="vector"
            textButton={infoPosts.button}
            linkButton="posts"
          />
        </div>
        <div className="relative grid grid-cols-1 justify-items-center px-5 [direction:ltr]">
          {posts?.map((postEntry, index) => (
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} key={index}>
              <PostCard post={postEntry} />
            </Tilt>
          ))}
        </div>
      </div>
    </div>
  );
}
