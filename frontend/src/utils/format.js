export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatMoney(value, currency = 'USD') {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}

export function statusClass(status) {
  const map = {
    pending: 'statusPending',
    processing: 'statusProcessing',
    shipped: 'statusShipped',
    delivered: 'statusDelivered',
    cancelled: 'statusCancelled',
    active: 'statusDelivered',
    suspended: 'statusCancelled',
    approved: 'statusDelivered',
    published: 'statusDelivered',
    rejected: 'statusCancelled'
  };
  return map[status] || 'statusPending';
}

export function initials(name = 'U') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}