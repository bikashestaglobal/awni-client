import React from "react";
import { InstapaperShareButton, InstapaperIcon } from "react-share";
import { useLocation } from "react-router-dom";
export default function FacebookSharingButton({ url, quotes, hashtag }) {
  let location = useLocation();

  return (
    <InstapaperShareButton
      url={url || window.location.href}
      quote={quotes || "Awni - World is yours to explore"}
      hashtag={hashtag || "#awni"}
      //   className={classes.socialMediaButton}
    >
      <InstapaperIcon size={47} />
    </InstapaperShareButton>
  );
}
