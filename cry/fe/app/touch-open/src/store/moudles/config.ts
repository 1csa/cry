import { defineStore } from 'pinia';
import { getCity } from '@/services/goods';

type OptionType = {
  label: string;
  value: string;
  children?: OptionType[]
}

type StateType = {
  cityList: OptionType[];
}

export const useConfigStore = defineStore({
  id: 'app-config',
  state: (): StateType => ({
    cityList: []
  }),
  getters: {
    getCityList(): OptionType[] {
      return this.cityList;
    },
  },
  actions: {
    // 获取省市区
    async fetchCityList(): Promise<OptionType[] | undefined> {
      try {
        if (this.cityList.length) {
          return
        }
        const {result} = await getCity();
        this.cityList = result;
      } catch (error) {
        return [];
      }
    }
  },
});
