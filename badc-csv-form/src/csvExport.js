export function downloadCSV(data) {
  const headers = Object.keys(data).join(",");
  const values = Object.values(data).join(",");
  const csv = `${headers}\n${values}`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "form-data.csv";
  a.click();

  URL.revokeObjectURL(url);
}
