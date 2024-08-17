import React, { useState, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";

import getImageByName from "utils/getImageByName";
import muted from "images/muted.png";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import unmuted from "images/unmuted.png";

import { IPad } from "types/Music";

import s from "./Project.module.scss";

interface ProjectProps {
  project: IPad;
  moveProject: (dragItem: IPad, hoverItem: IPad) => void;
  onDelete: (projectId: string) => void;
  onSelect: (index: number) => void;
  isSelected: boolean;
}

function Project({
  project,
  moveProject,
  onDelete,
  onSelect,
  isSelected,
}: ProjectProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = useCallback(() => {
    onSelect(project.order);
  }, [onSelect, project.order]);

  const handleDelete = useCallback(() => {
    onDelete(project.id);
  }, [onDelete, project.id]);

  const [, drag] = useDrag<IPad, unknown, any>({
    type: "project",
    item: { ...project },
  });

  const [, drop] = useDrop({
    accept: "project",
    hover(item: IPad) {
      moveProject(item, project);
    },
  });

  return (
    <div
      ref={(element) => drag(drop(element))}
      className={s.project}
      style={{
        boxShadow: isSelected ? `0px 0px 10px ${project.color}` : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={s.imageWrapper}>
        <img
          src={getImageByName(project.imageVariant)?.image}
          alt="imageVariant"
          style={{ backgroundColor: project.color, opacity: 0.375 }}
          className={`${s.image} ${isHovered ? s.hovered : ""}`}
        />
        <div className={s.absolute} />
        <div className={s.project__categories}>
          {project.config.categories.map((cat) => (
            <img
              key={cat.id}
              src={cat.isMuted ? muted : unmuted}
              className={s.project__category}
              alt="un/muted"
            />
          ))}
          <button onClick={handleSelect} type="button" className={s.absolute}>
            123
          </button>
          {isHovered && (
            <button
              onClick={handleDelete}
              type="button"
              className={s.deleteButton}
            >
              <CloseSettingsIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
