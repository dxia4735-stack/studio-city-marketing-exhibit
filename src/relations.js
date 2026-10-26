/** Stable meanings shared by the relationship model and its written legend. */
export const RELATION_TYPES = Object.freeze({
  entertainment: Object.freeze({ label: '娱乐组合', color: '#e5bf78' }),
  hotel: Object.freeze({ label: '住宿升级', color: '#7dafff' }),
  dining: Object.freeze({ label: '餐饮休息', color: '#6ed8bb' }),
});

// A link has the same meaning in either direction; hotel + dining is a stay upgrade.
export function classifyRelation(from, to) {
  if (from === 'hotel' || to === 'hotel') return 'hotel';
  if (from === 'dining' || to === 'dining') return 'dining';
  return 'entertainment';
}
