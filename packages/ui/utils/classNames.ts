export default function classNames(entries: [string, boolean][]) {
  return entries.filter(([,shouldApply]) => shouldApply).map(([css]) => css).join(' ');
}