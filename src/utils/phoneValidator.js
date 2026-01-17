// Paraguay phone validation utilities

const normalize = (raw) => {
  if (!raw) return null;
  let s = String(raw).trim();
  // Remove spaces, dashes, parentheses
  s = s.replace(/[ \-()\.]/g, '');
  // Replace leading 0 with +595 for local mobile 09xx...
  if (/^09\d{7}$/.test(s)) return '+595' + s.slice(1);
  if (/^9\d{7}$/.test(s)) return '+595' + s;
  if (/^\+5959\d{7}$/.test(s)) return s;
  if (/^\+595\d{7,9}$/.test(s)) return s;
  return s;
};

const isValid = (raw) => {
  const s = normalize(raw);
  if (!s) return false;
  // Accept +5959XXXXXXX or +595 9XXXXXXX or local formats
  return /^\+5959\d{7}$/.test(s);
};

module.exports = { normalize, isValid };
