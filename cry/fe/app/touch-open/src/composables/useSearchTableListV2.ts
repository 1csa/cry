/**
 * 通用表格 组合式api
 * 此 api 是提取表格的显示和操作方法的公用性，
 * 实现了数据的加载加载，分页查询，条件筛选，表格多选，条件重置等功能，
 * 通过`getList`这个方法来加载数据，
 * props说明：
 * @param fetchData 接口api
 * @param formatParams 查询条件
 * @param formatResponse 接口返回{list:[], total: 0}
 * @param paginationOption 自定义的分页key值，默认[page, page_size]
 * 其他功能可查看代码使用
 */

import { reactive, toRefs, computed, ref, onMounted, onActivated, unref } from 'vue';
import type { ApiDataType } from 'axios';
import { removeNullItem, formatEnum } from '@/utils/utils';
import useFormItemColumns from '@/composables/useFormItemColumns';
import { Form } from 'ant-design-vue';

interface FomartDataType {
  list: object[];
  total: number;
}

interface PaginationType {
  current: number;
  pageSize: number;
}

interface SorterType {
  field: string;
  order: string | undefined;
  columnKey?: string;
}

interface Props {
  fetchData: <T, P>(params: T) => Promise<ApiDataType<P>>;
  formatParams: (data: any) => { [x: string]: any };
  formatResponse?: (data: any) => FomartDataType;
  paginationOption?: Array<string>;
  listFormatEnum?: Boolean;
  pageSize?: number;
  firstLoaded?: boolean;
  formData?: any;
  defaultSortedInfo?: SorterType;
}

interface BaseReturnProps {
  list: [];
  num: number;
  page: number;
  page_size: number;
  total: number | string;
}

interface StateType {
  dataSource: Record<string, any> | undefined;
  tableLoading: boolean;
  total: number;
  pageNumber: number;
  page_size: number;
  selectedRowKeys: string[];
}
const sortedInfoVal = {
  field: '',
  order: undefined,
  columnKey: '',
};
export default function useSearchTableList(props: Props) {
  const {
    fetchData,
    formatParams,
    formatResponse,
    paginationOption = ['page', 'page_size'],
    listFormatEnum = false,
    pageSize = 20,
    firstLoaded = true,
    formData = {},
    defaultSortedInfo = sortedInfoVal,
  } = props;

  const searchFormRef = ref();
  const sortedInfo = ref<SorterType>(defaultSortedInfo);
  const useForm = Form.useForm;

  const { modelRef, rulesRef } = useFormItemColumns(formData);

  const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
  // 基础数据
  const STATE = reactive<StateType>({
    dataSource: [],
    tableLoading: false,
    total: 0,
    pageNumber: 1,
    page_size: pageSize,
    selectedRowKeys: [],
  });

  // 分页配置
  const pagination = computed(() => ({
    total: STATE.total,
    current: STATE.pageNumber,
    pageSize: STATE.page_size,
    showTotal: (total: number) => `共${total}条`,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page: number) => {
      STATE.pageNumber = page;
    },
    onShowSizeChange: (current: number, pageSize: number) => {
      STATE.pageNumber = 1;
      STATE.page_size = pageSize;
    },
  }));

  const rowSelection = computed(() => {
    return {
      preserveSelectedRowKeys: true,
      selectedRowKeys: unref(STATE.selectedRowKeys),
      onChange: (selectedRowKeys: string[]) => {
        STATE.selectedRowKeys = selectedRowKeys;
      },
    };
  });

  /**
   * 查询数据
   */
  const onSearch = () => {
    _checkSearchField().then(() => {
      STATE.pageNumber = 1;
      resertTable();
      getList();
    });
  };

  /**
   * 重置数据
   */
  const onReset = () => {
    resetFields();
    STATE.pageNumber = 1;
    resertTable();
    getList();
  };

  /**
   * 获取数据列表
   */
  const getList = async () => {
    STATE.tableLoading = true;
    try {
      const newParams = formatParams ? await formatParams(modelRef) : modelRef;
      let [page, page_size] = paginationOption;
      const data = removeNullItem({
        [page]: STATE.pageNumber,
        [page_size]: STATE.page_size,
        sort_field: sortedInfo.value.field,
        sort_value: sortedInfo.value.order,
        ...newParams,
      });
      const res = await fetchData<Record<string, any>, BaseReturnProps>(data);
      STATE.tableLoading = false;
      if (formatResponse) {
        const { list, total } = await formatResponse(res);

        STATE.dataSource = listFormatEnum ? formatEnum(list) : list;
        STATE.total = Number(total);
        return;
      }
      STATE.dataSource = listFormatEnum ? formatEnum(res.result.list) : res.result.list;
      STATE.total = Number(res.result.total);
    } catch (err) {
      throw err;
    }
  };

  /**
   * 检查搜索条件验证
   * @param searchFormRef
   * @returns {Promise<unknown>}
   */

  const _checkSearchField = () => {
    return new Promise<void>((resolve, reject) => {
      validate()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };

  /**
   * 表格排序，筛选
   */
  const onTableChange = (page: PaginationType, filters: any, sorter: SorterType) => {
    sorter.order && (sortedInfo.value = sorter);
    getList();
  };

  const resertTable = () => {
    sortedInfo.value = defaultSortedInfo;
    STATE.selectedRowKeys = [];
  };

  onActivated(() => {
    firstLoaded && getList();
  });

  return {
    ...toRefs(STATE),
    onSearch,
    onReset,
    pagination,
    getList,
    searchFormRef,
    onTableChange,
    sortedInfo,
    rowSelection,
    validateInfos,
    modelRef,
  };
}
