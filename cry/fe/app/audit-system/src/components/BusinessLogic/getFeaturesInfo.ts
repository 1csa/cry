import { featuresCn } from '@/data/constants';
import { isJSON } from '@/utils/dev_helper';

/**
 * 一个初始化 模型标记 映射
 * @param features 接口返回的模型标记分数
 * @param leader 封面图涉习
 * @returns leader?.words.length ? featuresInfo + '封面图涉习' : featuresInfo
 */
export default function initFeaturesInfo(features: string, leader: string) {
  const featuresInfo: string[] = [];
  // const featuresObj = features && typeof features === 'string' ? JSON.parse(features) : features;
  const featuresObj = isJSON(features) ? JSON.parse(features) : features;
  // 不讲道理啊 出现了 '{a: 3, b: 'sss'}' 类似的数据...
  if (Object.prototype.toString.call(featuresObj) === '[object Object]') {
    for (var key in featuresObj) {
      if (featuresObj[key] >= 0.9) {
        featuresInfo.push(featuresCn[key]);
      }
    }
    return (leader ? [...featuresInfo, leader] : [...featuresInfo]).filter(ele => ele);
  }
  // return leader ? [...featuresInfo, leader].filter(ele => ele) : featuresInfo.filter(ele => ele);
  return [];
}
