export default function resolveImageUrl(image: string): string{
  // 处理图片
  if (image.indexOf('https://') > -1 || image.indexOf('http://') > -1) {
    return image;
  } else {
    return `http://i1.go2yd.com/image.php?url=${image}`;
  }
};