import { expect, test } from "vitest";
import { data, reorderCards } from "../sample.js";

// TC one: Reordering within the same index
// TC Two: Reordering to a lower index
// TC Three: Reordering to a higher index
// TC Four: Reordering to the beginning of the array
// TC Five: Reordering to the end of the array
// TC six: Reorder and revert.

test("Reordering within the same index", () => {
  expect(reorderCards(data)).toMatchObject(data);
});

// 4 to 2, i.e card 5 to card 3
test("Reordering to a lower index", () => {
  const final = [
    {
      title: "one",
      order: 1,
    },
    {
      title: "two",
      order: 2,
    },
    {
      title: "five",
      order: 3,
    },
    {
      title: "three",
      order: 4,
    },
    {
      title: "four",
      order: 5,
    },
    {
      title: "six",
      order: 6,
    },
  ];

  const reorderedData = reorderCards(data, 4, 2);
  expect(reorderedData).toMatchObject(final);
});

// 2 to 5, i.e card 3 to card 6
test("Reordering to a higher index", () => {
  const final = [
    {
      title: "one",
      order: 1,
    },
    {
      title: "two",
      order: 2,
    },
    {
      title: "four",
      order: 3,
    },
    {
      title: "five",
      order: 4,
    },
    {
      title: "six",
      order: 5,
    },
    {
      title: "three",
      order: 6,
    },
  ];
  const reorderedData = reorderCards(data, 2, 5);
  expect(reorderedData).toMatchObject(final);
});

// 5 to 0, i.e card 6 to card 1
test("Reordering to the beginning of the array", () => {
  const final = [
    {
      title: "six",
      order: 1,
    },
    {
      title: "one",
      order: 2,
    },
    {
      title: "two",
      order: 3,
    },
    {
      title: "three",
      order: 4,
    },
    {
      title: "four",
      order: 5,
    },
    {
      title: "five",
      order: 6,
    },
  ];

  const reorderedData = reorderCards(data, 5, 0);
  expect(reorderedData).toMatchObject(final);
});

// 0 to 5, i.e card 1 to card 6
test("Reordering to the end of the array", () => {
  const final = [
    {
      title: "two",
      order: 1,
    },
    {
      title: "three",
      order: 2,
    },
    {
      title: "four",
      order: 3,
    },
    {
      title: "five",
      order: 4,
    },
    {
      title: "six",
      order: 5,
    },
    {
      title: "one",
      order: 6,
    },
  ];

  const reorderedData = reorderCards(data, 0, 5);
  expect(reorderedData).toMatchObject(final);
});

// 4 to 5, i.e card 5 to card 6 and revert.
test("Reordering and reverting", () => {
  const reorderCheck = [
    {
      title: "one",
      order: 1,
    },
    {
      title: "two",
      order: 2,
    },
    {
      title: "three",
      order: 3,
    },
    {
      title: "four",
      order: 4,
    },
    {
      title: "six",
      order: 5,
    },
    {
      title: "five",
      order: 6,
    },
  ];

  const reorderedData = reorderCards(data, 4, 5);
  expect(reorderedData).toMatchObject(reorderCheck);

  const revertedData = reorderCards(reorderedData, 5, 4);
  expect(revertedData).toMatchObject(data);
});
