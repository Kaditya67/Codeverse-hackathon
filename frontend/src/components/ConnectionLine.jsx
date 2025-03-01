import React from "react";
import { getBezierPath } from "reactflow";

const ConnectionLine = ({ sourceX, sourceY, targetX, targetY }) => {
  const edgePath = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <path fill="none" stroke="black" strokeWidth="2" d={edgePath} />
    </g>
  );
};

export default ConnectionLine;
