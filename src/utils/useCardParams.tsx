import { useSearchParams } from "react-router-dom";

export default function useCardParams() {
  const [searchParams] = useSearchParams();
  const selectedCard = searchParams.get("selectedCard");

  return selectedCard;
}
