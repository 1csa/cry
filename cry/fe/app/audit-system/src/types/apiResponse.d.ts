type ListNum = 'countAll' | 'page' | 'pageAll' | 'size';

interface IAllTypes extends Record<ListNum, number> {
  data: Array<any>;
}

export type PromiseDataType = Partial<IAllTypes> | number | Array<any>;

export interface ApiResponseProps {
  errorno: number;
  data: Partial<IAllTypes> | number | Array<any>;
  desc: string;
}

export type ResponseProps = Promise<ApiResponseProps>;
