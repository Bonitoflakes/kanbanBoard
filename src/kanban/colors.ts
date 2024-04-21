export type ColumnType = keyof typeof ColumnColors;

export const ColumnColors = {
  archived: {
    bg: "bg-[#2C593F]",
    text: "text-[#2C593F]",
    circle: "bg-[#2D9963]",
  },
  todo: {
    bg: "bg-[#482F64]",
    text: "text-[#482F64]",
    circle: "bg-[#8E5BC1]",
  },
  doing: {
    bg: "bg-[#6F3630]",
    text: "text-[#6F3630]",
    circle: "bg-[#CD4846]",
  },
  done: {
    bg: "bg-[#29456C]",
    text: "text-[#29456C]",
    circle: "bg-[#2E7CD1]",
  },
};

export const TextAreaColors = {
  archived: {
    border: "border-[#2d9963]",
    bg: "bg-[#2d9963]",
  },
  todo: {
    border: "border-[#8e5bc1]",
    bg: "bg-[#8e5bc1]",
  },
  doing: {
    border: "border-[#ff2925]",
    bg: "bg-[#9c5a59]",
  },
  done: {
    border: "border-[#2e7cd1]",
    bg: "bg-[#2e7cd1]",
  },
};
