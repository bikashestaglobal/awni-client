import React from "react";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { useLocation } from "react-router-dom";
export default function FacebookSharingButton({ url, quotes, hashtag }) {
  let location = useLocation();

  return (
    <WhatsappShareButton
      url={url || window.location.href}
      quote={quotes || "Awni - World is yours to explore"}
      hashtag={hashtag || "#awni"}
      //   className={classes.socialMediaButton}
    >
      <WhatsappIcon size={47} />
    </WhatsappShareButton>
  );
}
