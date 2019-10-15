export function parseSqlDate(sqlDate) {
  const a = sqlDate.split('T');
  const d = a[0].split('-');
  const t = a[1].split(':');
  return new Date(d[0], d[1], d[2], t[0], t[1], 0);
}