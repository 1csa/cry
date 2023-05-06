import { IPhotoSensitive, IsvgSize } from '@/components/Smart/MediaContentMainPanel';

/**
 * 需要利用Map结构将url作为Key 数据数组作为value，在渲染的时候再为对应的图片设置
 *
 * 初始化svg包含的rect的标签组
 * @param sourceData 这是传入的OCR命中的数据
 * @param svgSize svg的尺寸 需要跟图片的尺寸大小相同 否则坐标会错位
 * @return svg的标签string 因为map的数组被string了所以会出现逗号，需要将其替换掉
 */
const initSVGDomString = (sourceData: IPhotoSensitive[], svgSize: IsvgSize) => {
  const initRect = () => {
    return sourceData?.map((item: IPhotoSensitive) => {
      return `<rect
          key="${item.coordinate.x + item.coordinate.y}"
          x="${item.coordinate.x}"
          y="${item.coordinate.y}"
          height="${item.lineHeight}"
          width="${item.lineWidth}"
          rx="5"
          ry="5"
          stroke="${item.stroke}"
          fill="none"
        />
      `;
    });
  };
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="${svgSize.width}"
      height="${svgSize.height}"
      style="position: absolute; top: 0; left: 0;"
    >
      ${initRect()
        .toString()
        .replace(',', '')}
    </svg>`;
};

/**
 * 组合图片和svg的标签string
 * @param baseImg
 * @param svg
 */
const composeTemplate = (baseImg: string, svg: string) => {
  return `
    <div style="position: relative">${baseImg}${svg}</div>
  `;
};

/**
 * 提供渲染为最终的字符串能力
 * @param photoSensitive
 * @param svgSize
 * @param baseHtmlString
 */
const useSVGDraw = (photoSensitive: any, svgSize: IsvgSize, baseHtmlString: string) => {
  // 匹配所有图片
  const imgReg = /(<img.+?>)/g;
  // 匹配src内容
  const srcReg = /src="(.*?)"/;
  let newHtmlString = '';

  /**
   * substring为当前匹配到的img标签，因为map的结构是图片的url作为key，所以这里需要提取出来img中的src地址去map中找对应的图片所命中的文字的坐标
   * 如果命中的话，取数据 执行初始化svg的函数
   * 没命中的话就返回原来的
   */
  const finishHtml = baseHtmlString.replace(imgReg, (substring: string) => {
    const imgSrc = substring.match(srcReg)![1];

    if (photoSensitive.has(imgSrc)) {
      const imgTextInfo = photoSensitive.get(imgSrc);
      const svgRect = initSVGDomString(imgTextInfo, svgSize);
      newHtmlString = composeTemplate(substring, svgRect);
    } else {
      newHtmlString = substring;
    }
    return newHtmlString;
  });

  return finishHtml;
};

export default useSVGDraw;
