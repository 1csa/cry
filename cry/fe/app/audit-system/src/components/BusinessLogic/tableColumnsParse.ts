/**
 * 一些表单的行数据解析
 */

import { getWords, getUserReviewTag } from '@/components/BusinessLogic';
import { ManualStatus, ManualType } from '@/types';
import { reviewStatus, videoTitleType } from '@/data/constants';

const parseColumns = {
  /**
   * 处理机器审核信息
   */
  getMachineResult: (machine_result: any) => {
    // 需要对用户资料、负反馈和评论都处理
    const feedbackWords =
      (machine_result &&
        getWords({
          fv: machine_result?.sensitive?.context?.words?.length
            ? machine_result?.sensitive?.context?.words
            : machine_result?.sensitive?.content?.words?.length
            ? machine_result?.sensitive?.content?.words
            : machine_result?.sensitive?.summary?.words,
          sv: machine_result?.sensitive?.title?.words,
          tv: machine_result?.sensitive?.subTitle?.words,
          fourV: machine_result?.sensitive?.comment?.words,
        })) ||
      [];
    const userprofileWords =
      (machine_result &&
        getWords({
          fv: machine_result?.sensitive?.brief?.words,
          sv: machine_result?.sensitive?.headImage?.words,
          tv: machine_result?.sensitive?.nick?.words,
        })) ||
      [];
    return feedbackWords.length ? feedbackWords.join('、') : userprofileWords.join('、');
  },
  /**
   * 处理人审标签
   */
  getManualResult: (record: any, materialType?: number) => {
    // 依次倒着判断
    const { result_l1, result_l2, result_l3, result } = record;
    let resultStatus: ManualType = result_l3 || result_l2 || result_l1 || result || '';
    resultStatus = resultStatus && typeof resultStatus === 'string' ? JSON.parse(resultStatus) : resultStatus;
    // 人审标签 处理各种不同的标签 顺序为先曝光 再负反馈和评论最后用户资料
    const results =
      resultStatus?.labels && Array.isArray(resultStatus?.labels)
        ? resultStatus?.labels
            .map(item =>
              videoTitleType[item.group!]
                ? `${videoTitleType[item.group!]} - ${item.label}`
                : item.code === 'other'
                ? `${item.label}(${item.desc ?? '--'})`
                : item.label,
            )
            .join('、')
        : getUserReviewTag(record.material_type || materialType)[resultStatus?.desc]
        ? getUserReviewTag(record.material_type || materialType)[resultStatus?.desc]
        : [
            ...new Set(
              [...(resultStatus?.result_tags_brief ?? []), ...(resultStatus?.result_tags_header_img ?? []), ...(resultStatus?.result_tags_nick ?? [])]
                .filter((item: ManualStatus) => item.status !== 3102)
                .map((item: ManualStatus) => item.type),
            ),
          ].join('、');

    return results;
  },
  getAuditResult: (record: any, text: number) => {
    const { status_l3, status_l2, status_l1 } = record;
    // 依次从最后一次审核状态往前判断，如果人审状态没有则用机审状态
    const status: number = status_l3 || status_l2 || status_l1 || text;
    return reviewStatus(status);
  },
};

export default parseColumns;
