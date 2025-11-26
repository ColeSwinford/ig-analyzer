export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  let csvContent = "data:text/csv;charset=utf-8,Username,Profile URL,Date Followed\n";
  data.forEach(user => {
      const date = new Date(user.timestamp).toLocaleDateString();
      csvContent += `${user.username},https://instagram.com/${user.username},${date}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};