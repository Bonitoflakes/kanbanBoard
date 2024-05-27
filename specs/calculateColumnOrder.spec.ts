import { describe, expect, test } from "vitest";
import { calculateColumnOrder, FourPermutations } from "../sample2.ts";

describe("calculateCardOrder", () => {
  FourPermutations.forEach((permutation, index) => {
    test(`Column Permutation ${index + 1}`, () => {
      const { originOrder, targetOrder, closestEdge, newOrder } = permutation;

      const result = calculateColumnOrder({
        originOrder,
        targetOrder,
        closestEdge,
      });
      expect(result).toBe(newOrder);
    });
  });
});
