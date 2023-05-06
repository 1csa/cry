export default function toCam(str: string) {
  return str.replace(/^[a-z]/, (s) => s.toUpperCase());
}
