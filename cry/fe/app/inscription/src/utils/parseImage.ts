/**
 * 将图片转换为http方式访问
*/

const parseImage = (image: string) => {
  return image.indexOf('http') > -1 ? image : `http://i1.go2yd.com/image.php?url=${image}`;
}

export default parseImage;


