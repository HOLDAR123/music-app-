import React from "react";
import { IPad, allCategories } from "types/Music";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import UploadIcon from "components/icons/UploadIcon";
import Button from "components/common/Button";

import { toast } from "react-toastify";

import s from "./ProjectItem.module.scss";

interface ProjectItemProps {
  project: IPad;
  DeleteProject: (id: string) => void;
}

function ProjectItem({ project, DeleteProject }: ProjectItemProps) {
  const DeleteProjectItem = () => {
    const result = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (result) {
      DeleteProject(project.id);
      toast.success("Everything went well");
    }
  };

  return (
    <div className={s.container}>
      <div className={s.nameProject}>
        {project.title.length > 15
          ? `${project.title.slice(0, 15)}...`
          : project.title}
      </div>
      <div className={s.nameMusicTypesUsage}>
        {allCategories.map((category) => (
          <div
            key={category}
            className={
              project.config.categories.find((cat) => cat.type === category)
                ? s.whiteFont
                : s.defaultColor
            }
          >
            {category}
          </div>
        ))}
      </div>
      <div className={s.projectActions}>
        <button type="button" onClick={DeleteProjectItem}>
          <CloseSettingsIcon />
        </button>
        <Button variant="filledColored" className={s.iconSetting}>
          <UploadIcon />
          Load
        </Button>
      </div>
    </div>
  );
}

export default ProjectItem;
