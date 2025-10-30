type VideoProps = {
  src: string;
  type?: string;
  classname?: string;
  height?: number;
  width?: number;
};

export function Video({ src, type = "video/mp4", classname, height, width }: VideoProps) {
  // Youtube videos
  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");

  if (isYouTube) {
    const embedSrc = src
      .replace("watch?v=", "embed/")
      .replace("youtube.com/shorts/", "youtube.com/embed/");

    return (
      <iframe
        width={width}
        height={height}
        src={embedSrc}
        className={classname}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video width={width} height={height} controls preload="none" className={classname}>
      <source src={src} type={type} />
      Your browser does not support the video tag.
    </video>
  );
}
