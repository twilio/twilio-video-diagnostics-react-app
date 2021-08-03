export const downloadJSONFile = (data: any) => {
  const link = document.createElement('a');
  link.download = 'test_results.json';
  link.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], {
      type: 'text/plain',
    })
  );
  link.click();
};
