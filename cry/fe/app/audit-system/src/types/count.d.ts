/**
 * by yangsen
 * 获取统计数据 请求参数格式
 */
type CountProps = {
  business_unit_type: string // 子业务
  outstyle: string // 输出的格式 固定值 json
  auditor_id_will: string // 审核员 邮箱前缀
  business_type?: string //业务
  clsexp?: number // 是否获取下拉菜单待审核数据
}

export default CountProps