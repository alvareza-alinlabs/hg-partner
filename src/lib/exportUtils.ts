export const exportData = (data: any[], filename: string, type: "csv" | "json" | "pdf") => {
  if (type === "json") {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${filename}.json`;
    link.click();
  } else if (type === "csv") {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    
    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(csvRows.join("\n"))}`;
    const link = document.createElement("a");
    link.href = csvString;
    link.download = `${filename}.csv`;
    link.click();
  } else if (type === "pdf") {
    // For PDF, we'll invoke the browser's print dialog which natively supports PDF exporting
    window.print();
  }
};

export const importData = (file: File, callback: (data: any[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string;
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(result);
         callback(Array.isArray(parsed) ? parsed : []);
      } else if (file.name.endsWith('.csv')) {
        const lines = result.split('\\n');
        if (lines.length < 2) return callback([]);
        const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          data.push(obj);
        }
        callback(data);
      }
    } catch (err) {
      console.error("Error parsing file", err);
      alert("Format file tidak didukung atau corrupt.");
    }
  };
  reader.readAsText(file);
};
