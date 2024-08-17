import React from "react";

import LivePadsContent from "components/LivePadsContent";

import s from "./TabsPage.module.scss";

function TabsPage() {
  return (
    <div className={s.container}>
      <LivePadsContent />
    </div>
  );
}

export default TabsPage;
