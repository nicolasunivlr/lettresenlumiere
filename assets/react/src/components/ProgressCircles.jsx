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

const getProgressStyle = (score) => {
  if (!score) return DEFAULT_STYLE;
  const entry = PROGRESS_STYLE_MAP.find((e) => score <= e.max);
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

export const ProgressCircles = ({ count, current, scores, onChange }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {Array.from({ length: count }, (_, index) => (
          <Circle
            key={`circle-${index}`}
            label={index + 1}
            style={getProgressStyle(scores[index])}
            active={current === index}
            onClick={() => onChange(index)}
          />
        ))}
      </div>
    </div>
  );
};
