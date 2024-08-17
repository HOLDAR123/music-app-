import React from "react";

import ProfilePageContent from "components/ProfilePageContent";
import s from "./ProfilePage.module.scss";

function ProfilePage() {
  return (
    <div className={s.container}>
      <ProfilePageContent />
    </div>
  );
}

export default ProfilePage;
