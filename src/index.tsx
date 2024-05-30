import React from "react";
import { createRoot } from "react-dom/client";
import { registerLicense } from "@syncfusion/ej2-base";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NBaF1cXmhPYVZpR2Nbe05xdV9EZlZRQWYuP1ZhSXxXdkBhUH5fcnJVQ2JUVkc="
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
