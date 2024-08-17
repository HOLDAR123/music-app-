import React from "react";

import SettingsPageContent from "components/SettingsPageContent";

import s from "./SettingsPage.module.scss";

function SettingsPage() {
  return (
    <div className={s.container}>
      <SettingsPageContent />
    </div>
  );
}

export default SettingsPage;
