# CV Pagination Audit Notes

Internal follow-up for the renderer pass.

- Downloaded PDF is the source of truth for CV output.
- Web preview should move toward parity with the downloaded PDF, not the other way around.
- Current pagination can cut content awkwardly when a section or entry is moved as a whole.
- Page breaks can leave large blank chunks when unsplittable blocks overflow late on a page.
- Essential and Structured need a later typography, density, and page-break audit.
- Do not change PDF download routing, export routing, print routing, iframe attributes, or the render/export contract during shell-only UI passes.
