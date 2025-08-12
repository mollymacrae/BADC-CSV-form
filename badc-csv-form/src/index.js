import { createForm } from "./formUI.js";
import { downloadCSV } from "./csvExport.js";

export function initFormToCSV(container) {
  const form = createForm(downloadCSV);
  container.appendChild(form);
}
