export const TwelevePermutations = [
  {
    originOrder: 1,
    targetOrder: 5,
    isSameColumn: true,
    closestEdge: "bottom",
    newOrder: 5,
  },
  {
    originOrder: 5,
    targetOrder: 1,
    isSameColumn: true,
    closestEdge: "bottom",
    newOrder: 2,
  },
  {
    originOrder: 1,
    targetOrder: 1,
    isSameColumn: false,
    closestEdge: "bottom",
    newOrder: 2,
  },
  {
    originOrder: 4,
    targetOrder: 2,
    isSameColumn: false,
    closestEdge: "bottom",
    newOrder: 3,
  },
  {
    originOrder: 1,
    targetOrder: 5,
    isSameColumn: false,
    closestEdge: "bottom",
    newOrder: 6,
  },
  {
    originOrder: 2,
    targetOrder: 3,
    isSameColumn: false,
    closestEdge: "bottom",
    newOrder: 4,
  },
  {
    originOrder: 5,
    targetOrder: 2,
    isSameColumn: true,
    closestEdge: "top",
    newOrder: 2,
  },
  {
    originOrder: 2,
    targetOrder: 5,
    isSameColumn: true,
    closestEdge: "top",
    newOrder: 4,
  },
  {
    originOrder: 5,
    targetOrder: 2,
    isSameColumn: false,
    closestEdge: "top",
    newOrder: 2,
  },
  {
    originOrder: 2,
    targetOrder: 5,
    isSameColumn: false,
    closestEdge: "top",
    newOrder: 5,
  },
  {
    originOrder: 1,
    targetOrder: 1,
    isSameColumn: false,
    closestEdge: "top",
    newOrder: 1,
  },
  {
    originOrder: 2,
    targetOrder: 1,
    isSameColumn: false,
    closestEdge: "top",
    newOrder: 1,
  },
];

export const FourPermutations = [
  // BUGGY
  {
    originOrder: 1,
    targetOrder: 3,
    closestEdge: "right",
    newOrder: 3,
  },
  {
    originOrder: 5,
    targetOrder: 2,
    closestEdge: "right",
    newOrder: 3,
  },
  {
    originOrder: 2,
    targetOrder: 1,
    closestEdge: "left",
    newOrder: 1,
  },
  // BUGGY
  {
    originOrder: 2,
    targetOrder: 4,
    closestEdge: "left",
    newOrder: 3,
  },
];

type columnOrder = {
  originOrder: number;
  targetOrder: number;
  closestEdge: string;
};

type cardOrder = {
  originOrder: number;
  targetOrder: number;
  isSameColumn: boolean;
  closestEdge: string;
};

export const calculateCardOrder = (props: cardOrder) => {
  const { originOrder, targetOrder, isSameColumn, closestEdge } = props;

  console.log("Closest edge", closestEdge);
  console.log("Is same column", isSameColumn);
  console.log("Origin", originOrder);
  console.log("Target", targetOrder);
  const isOriginHigher = originOrder > targetOrder;

  let newOrder: null | number = null;

  if (closestEdge === "bottom") {
    if (isSameColumn && !isOriginHigher) {
      newOrder = targetOrder;
    }

    if (isSameColumn && isOriginHigher) {
      newOrder = targetOrder + 1;
    }

    if (!isSameColumn && !isOriginHigher) {
      newOrder = targetOrder + 1;
    }

    if (!isSameColumn && isOriginHigher) {
      newOrder = targetOrder + 1;
    }
  }

  if (closestEdge === "top") {
    if (isSameColumn && isOriginHigher) {
      newOrder = targetOrder;
    }
    if (isSameColumn && !isOriginHigher) {
      newOrder = targetOrder - 1;
    }
    if (!isSameColumn && isOriginHigher) {
      newOrder = targetOrder;
    }
    if (!isSameColumn && !isOriginHigher) {
      newOrder = targetOrder;
    }
  }

  console.log("NewOrder", newOrder);
  return newOrder;
};

export const calculateColumnOrder = (props: columnOrder) => {
  const { originOrder, targetOrder, closestEdge } = props;

  console.log("Closest edge", closestEdge);
  console.log("Origin", originOrder);
  console.log("Target", targetOrder);
  const isOriginHigher = originOrder > targetOrder;

  let newOrder = targetOrder;

  if (closestEdge === "right") {
    if (isOriginHigher) {
      newOrder = targetOrder + 1;
    }
  }

  if (closestEdge === "left") {
    if (!isOriginHigher) {
      newOrder = targetOrder - 1;
    }
  }

  return newOrder;
};
