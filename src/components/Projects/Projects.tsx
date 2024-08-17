import React from "react";

import { IPad } from "types/Music";

import AddIcon from "@mui/icons-material/Add";
import Project from "components/Project/Project";

import s from "./Projects.module.scss";

interface ProjectsProps {
  projects: IPad[];
  onSelect: (index: number) => void;
  moveProject: (dragItem: IPad, hoverItem: IPad) => void;
  onDelete: (projectId: string) => void;
  selectedIndex: number | undefined;
  addRandomProject: () => void;
}

function Projects({
  projects,
  moveProject,
  onDelete,
  onSelect,
  selectedIndex,
  addRandomProject,
}: ProjectsProps) {
  return (
    <div className={s.livePads__items}>
      {projects.map((project) => (
        <Project
          project={project}
          key={project.id}
          isSelected={selectedIndex === project.order}
          onSelect={onSelect}
          moveProject={moveProject}
          onDelete={onDelete}
        />
      ))}
      <button
        type="button"
        onClick={addRandomProject}
        className={s.livePads__addItem}
      >
        <AddIcon className={s.icon} />
      </button>
    </div>
  );
}

export default Projects;
