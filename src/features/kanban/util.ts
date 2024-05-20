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

export const calculateCardOrder = (props: cardOrder): number => {
  const { originOrder, targetOrder, isSameColumn, closestEdge } = props;

  console.group("calculateCardOrder");
  console.log("Closest edge", closestEdge);
  console.log("Is same column", isSameColumn);
  console.log("Origin", originOrder);
  console.log("Target", targetOrder);
  console.groupEnd();

  const isOriginHigher = originOrder > targetOrder;

  let newOrder: number = targetOrder;

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

  console.group("calculateColumnOrder");
  console.log("Closest edge", closestEdge);
  console.log("Origin", originOrder);
  console.log("Target", targetOrder);
  console.groupEnd();

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

export const adjacentColumns = (
  closestEdge: string,
  originOrder: number,
  targetOrder: number,
) => {
  if (closestEdge === "left" && originOrder === targetOrder - 1) {
    return true;
  }

  if (closestEdge === "right" && originOrder === targetOrder + 1) {
    return true;
  }

  return false;
};

export const adjacentCards = (
  closestEdge: string,
  originOrder: number,
  targetOrder: number,
  isSameColumn: boolean,
) => {
  if (
    closestEdge === "top" &&
    originOrder === targetOrder - 1 &&
    isSameColumn
  ) {
    console.log("noop");
    return true;
  }

  if (
    closestEdge === "bottom" &&
    originOrder === targetOrder + 1 &&
    isSameColumn
  ) {
    console.log("noop");
    return true;
  }

  return false;
};
