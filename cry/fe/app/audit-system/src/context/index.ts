import React from 'react';

import { ComposeWordsType } from '@/types';
import { similarVideosArrayType } from '@/components/Dumb/SimilarVideos';

// TODO 考虑将这个context拆出去在index引入 类型也是
type MachineTagsKeys = 'scAd' | 'value' | 'key' | 'desc' | 'tag';

export type MachineTags = Record<MachineTagsKeys, string>;

export type ImageRisk = {
  sims: {
    score: number;
    src: string;
    tag: string;
  }[];
  url: string;
};

export interface ICreateMediaInfoContext {
  leader: string;
  sensitiveGroup: ComposeWordsType[];
  similarVideos: Partial<{
    type: string;
    data: similarVideosArrayType[];
  }>;
  machineModel: Partial<{
    machineTags: MachineTags[];
    imageRisk: ImageRisk[];
  }>;
}

// MediaInfo 面板展示组件 右侧里需要的一些涉领导人和敏感词组
export const CreateMediaInfoContext = React.createContext<ICreateMediaInfoContext>({
  leader: '',
  sensitiveGroup: [],
  similarVideos: {},
  machineModel: {
    machineTags: [],
    imageRisk: [],
  },
});
