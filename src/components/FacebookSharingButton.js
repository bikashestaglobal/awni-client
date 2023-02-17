import React from "react";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { useLocation } from "react-router-dom";
export default function FacebookSharingButton({ url, quotes, hashtag }) {
  let location = useLocation();

  return (
    <FacebookShareButton
      url={url || window.location.href}
      quote={quotes || "Awni - World is yours to explore"}
      hashtag={hashtag || "#awni"}
      //   className={classes.socialMediaButton}
    >
      <FacebookIcon size={47} />
    </FacebookShareButton>
  );
}
