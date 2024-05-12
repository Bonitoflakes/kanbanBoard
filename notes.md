# TODO:

<details>
  <summary>Implement drag and drop</summary>
</details>

---

---

---

<details>
  <summary>Figure out the solution for re-ordering Cards/Columns.</summary>
  Currently, the frontend is able to make the necessary changes to the cache,
  TODO: Added re-ordering to the backend.
</details>

<details>
  <summary>Optimistic updates with RTK Query.</summary>
  Currently, the frontend is able to make the necessary changes to the cache,
  TODO: Added re-ordering to the backend.
</details>

<details>
  <summary>Sidepeek blocks overflow scroll.</summary>
Solution: Animate width of the column view by -900px when the sidepeek is open.
</details>

<details>
  <summary>Fix re-shuffling of cards on save</summary>
Solution: Backend was sending data in the wrong format everytime.
</details>

<details>
  <summary>Fix editOptions styling</summary>
Solution: toggle between class="dark" in html file for tailwind to pick up dark mode correctly. Done using JS Script loaded eagerly in head.
</details>

<details>
  <summary>Animate out when navigating panels.</summary>
  Use a temporary shell which stays in the DOM and animates out when navigating to a different panel.
</details>

# CONCEPTS LEARNED:

- ### Redux with RTK Query.
- ### Dynamic theming with CSS Variables and tailwindcss.
- ### Drag and drop.

# Current Limitations:

- ### Columns are mapped based on title, if duplicate titles are added, the column will be rendered on top of the other column.
- ### Unable to close the sidepeek panel by clicking outside the panel.
- ### Unable to drag and drop cards.
