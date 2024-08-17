import React from "react";
import AvatarIcon from "components/icons/AvatarIcon";
import ProjectItem from "components/ProjectItem";

import { deleteProject } from "store/reducers/authReducer";

import { useAppSelector, useAppDispatch } from "hooks/store";

import s from "./ProfilePageContent.module.scss";

function ProfilePageContent() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.auth);

  const HandleDeleteProject = (id: string) => {
    dispatch(deleteProject(id));
  };

  return (
    <div className={s.container}>
      <div className={s.pageTitle}>Profile</div>
      <div className={s.sections}>
        <div className={s.userInfo}>
          <AvatarIcon />
          <span>Your name</span>
        </div>
        <div className={s.sectionTitle}>My projects</div>
        <div className={s.projectsSection}>
          <ul className={s.projectsSectionList}>
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectItem
                  project={project}
                  DeleteProject={HandleDeleteProject}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageContent;
