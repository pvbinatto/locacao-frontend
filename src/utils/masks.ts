export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const maskPlate = (value: string) => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/([A-Z]{3})(\d)/, '$1-$2')
    .substring(0, 8);
};

export const maskCurrency = (value: string) => {
  const v = value.replace(/\D/g, '');
  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(v) / 100
  );
  return 'R$ ' + result;
};

export const parseCurrencyToNumber = (value: string) => {
  return Number(value.replace(/\D/g, '')) / 100;
};
