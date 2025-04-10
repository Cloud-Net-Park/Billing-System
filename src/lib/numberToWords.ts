
export function numberToWords(num: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanThousand(num: number): string {
    if (num === 0) {
      return '';
    }
    if (num < 20) {
      return units[num];
    }
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    }
    return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertLessThanThousand(num % 100) : '');
  }
  
  if (num === 0) {
    return 'Zero';
  }
  
  let words = '';
  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  
  if (crores > 0) {
    words += convertLessThanThousand(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    words += convertLessThanThousand(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    words += convertLessThanThousand(thousands) + ' Thousand ';
  }
  if (num > 0) {
    words += convertLessThanThousand(num);
  }
  
  return words.trim();
}
