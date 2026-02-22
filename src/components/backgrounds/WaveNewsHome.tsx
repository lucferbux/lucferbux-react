export default function WaveNewsHome() {
  return (
    <div className="relative">
      <img
        src="/images/waves/course-wave1.svg"
        alt="Course Wave 1"
        className="absolute top-0 -z-1 3xl:w-full"
      />
      <img
        src="/images/waves/course-wave2.svg"
        alt="Course Wave 2"
        className="course-wave2 absolute top-[350px] 3xl:w-full min-[1560px]:top-[420px] min-[1850px]:top-[490px] min-[2100px]:top-[420px]"
      />
    </div>
  );
}

