import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppSelector } from "hooks/store";

import Layout from "layout";
import LivePage from "pages/LivePage";
import TabsPage from "pages/TabsPage";
import SettingsPage from "pages/SettingsPage";
import ProfilePage from "pages/ProfilePage";
import AuthorizationPage from "pages/AuthorizationPage";

function Router() {
  const { isAuthInitialized } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthInitialized ? (
          <>
            <Route path="/" element={<AuthorizationPage />} />
            <Route path="/login" element={<AuthorizationPage />} />
            <Route path="*" element={<div>404</div>} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<LivePage />} />
            <Route path="tabs" element={<TabsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<div>404</div>} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
