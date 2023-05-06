export default function (mail?: string): string {
  return mail ? decodeURIComponent(mail).replace("@yidian-inc.com", '') : '--';
}
