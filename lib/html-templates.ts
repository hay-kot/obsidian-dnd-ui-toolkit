import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";

export function Render(cmp: ReactElement) {
  return renderToString(cmp);
}
