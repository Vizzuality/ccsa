type VideoProps = {
  src: string;
  type?: string;
  classname?: string;
  height?: number;
  width?: number;
};

export function Video({ src, type = "video/mp4", classname, height, width }: VideoProps) {
  let isYouTube = false;
  let embedSrc = src;

  try {
    const url = new URL(src);
    const hostname = url.hostname.replace(/^www\./, "");

    isYouTube = hostname === "youtube.com" || hostname === "youtu.be";

    if (isYouTube) {
      // v parameter for regular YouTube links
      if (hostname === "youtube.com" && url.searchParams.has("v")) {
        embedSrc = `https://youtube.com/embed/${url.searchParams.get("v")}`;
      } else if (hostname === "youtu.be") {
        embedSrc = `https://youtube.com/embed/${url.pathname.slice(1)}`;
      } else {
        embedSrc = src.replace("youtube.com/shorts/", "youtube.com/embed/");
      }
    }
  } catch (err) {
    console.error("Invalid URL:", err);
  }

  if (isYouTube) {
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
