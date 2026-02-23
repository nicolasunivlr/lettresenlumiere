import React from "react";

const DEFAULT_STYLE = {
  backgroundColor: "white",
  color: "black",
};

const PROGRESS_STYLE_MAP = [
  { max: 25, style: { backgroundColor: "#b91c1c", color: "white" } },
  { max: 50, style: { backgroundColor: "orange", color: "black" } },
  { max: 75, style: { backgroundColor: "yellow", color: "black" } },
  { max: 100, style: { backgroundColor: "#166534", color: "white" } },
];

const getProgressStyle = (progress) => {
  if (!progress) return DEFAULT_STYLE;
  const entry = PROGRESS_STYLE_MAP.find((e) => progress.score <= e.max);
  return entry ? entry.style : PROGRESS_STYLE_MAP.at(-1).style;
};

export const Circle = ({ label, style, active, onClick }) => {
  return (
    <div
      className={active ? "circle circle--active" : "circle"}
      style={{ ...style }}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

/**
 *
 * Une colonne de cercles représentant une progression à travers un séquence.
 *
 * @param {{
 * count: number,
 * current?: number,
 * labels?: string[],
 * containerClassName: string,
 * progress: Array<{score: number}>,
 * onChange?: (index: number) => void
 * }} props

 */
export const ProgressCircles = ({
  count,
  current,
  progress,
  labels,
  containerClassName,
  onChange,
}) => {
  const isActive =
    current !== undefined ? (index) => index === current : () => false;
  return (
    <div className={containerClassName}>
      {Array.from({ length: count }, (_, index) => (
        <div key={`circle-container-${index}`} className="circle-container">
          <Circle
            key={`circle-${index}`}
            label={index + 1}
            style={getProgressStyle(progress[index])}
            active={isActive(index)}
            onClick={() => onChange?.(index)}
          />
          {labels && <p>{labels[index]}</p>}
        </div>
      ))}
    </div>
  );
};
