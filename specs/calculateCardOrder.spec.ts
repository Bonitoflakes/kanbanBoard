import { describe, expect, test } from "vitest";
import { calculateCardOrder, TwelevePermutations } from "../sample2.ts";

describe("calculateCardOrder", () => {
  TwelevePermutations.forEach((permutation, index) => {
    test(`Card Permutation ${index + 1}`, () => {
      const { originOrder, targetOrder, isSameColumn, closestEdge, newOrder } =
        permutation;

      const result = calculateCardOrder({
        originOrder,
        targetOrder,
        isSameColumn,
        closestEdge,
      });
      expect(result).toBe(newOrder);
    });
  });
});
