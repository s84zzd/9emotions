const XLSX = require('xlsx');
const filename = '推荐活动库.xlsx';
const workbook = XLSX.readFile(filename);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
console.log('Headers:', rows[0]);
console.log('First row:', rows[1]);
