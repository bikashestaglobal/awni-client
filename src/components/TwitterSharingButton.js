import React from "react";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { useLocation } from "react-router-dom";
export default function FacebookSharingButton({ url, quotes, hashtag }) {
  let location = useLocation();

  return (
    <TwitterShareButton
      url={url || window.location.href}
      quote={quotes || "Awni - World is yours to explore"}
      hashtag={hashtag || "#awni"}
      //   className={classes.socialMediaButton}
    >
      <TwitterIcon size={47} />
    </TwitterShareButton>
  );
}
