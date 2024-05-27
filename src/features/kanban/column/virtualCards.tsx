import { useVirtualizer } from "@tanstack/react-virtual";
import Card from "../card";
import { ColumnMap } from "@/types";

export const VirtualCards = ({
  column,
  columnRef,
}: {
  column: ColumnMap;
  columnRef: React.RefObject<HTMLDivElement>;
}) => {
  const cardVirtualizer = useVirtualizer({
    count: column.count,
    getScrollElement: () => columnRef.current,
    estimateSize: () => 150,
    overscan: 3,
    gap: 10,
    horizontal: false,
  });

  const items = cardVirtualizer.getVirtualItems();

  return (
    <div
      className="relative m-2 flex flex-col gap-[4px] overflow-auto"
      style={{ height: `${cardVirtualizer.getTotalSize()}px` }}
      ref={columnRef}
    >
      {items.map((vCard) => {
        const card = column.cards[vCard.index];
        return (
          <div
            key={vCard.index}
            data-index={vCard.index}
            ref={cardVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${vCard.start}px)`,
            }}
          >
            <Card key={card.id} {...card} />
          </div>
        );
      })}
    </div>
  );
};
