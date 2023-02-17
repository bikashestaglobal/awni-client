import React from "react";
import { LinkedinShareButton, LinkedinIcon } from "react-share";
import { useLocation } from "react-router-dom";
export default function FacebookSharingButton({ url, quotes, hashtag }) {
  let location = useLocation();

  return (
    <LinkedinShareButton
      url={url || window.location.href}
      quote={quotes || "Awni - World is yours to explore"}
      hashtag={hashtag || "#awni"}
      //   className={classes.socialMediaButton}
    >
      <LinkedinIcon size={47} />
    </LinkedinShareButton>
  );
}
