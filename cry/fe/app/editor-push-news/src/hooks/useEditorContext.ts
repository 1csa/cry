import { useContext, createContext } from 'react';

import { Biz, Temp, TempConfig, TempValue } from "@/config/editorpush/push";
import { default_biz, default_temp, default_temp_config, default_temp_value } from "@/config/editorpush/push.config";

type EditorContext = {
  biz: Biz;
  temp: Temp;
  config: TempConfig;
  value: TempValue;
}

const InitialAuthContext: EditorContext = {
  biz: default_biz,
  temp: default_temp,
  config: default_temp_config,
  value: default_temp_value
}

export const EditorContext = createContext<EditorContext>(InitialAuthContext);

export const EditorProvider = EditorContext.Provider;

export const useTempContext = () => {
  const { temp } = useContext<EditorContext>(EditorContext);

  return temp;
}

export const useBizContext = () => {
  const { biz } = useContext<EditorContext>(EditorContext);

  return biz;
}

export const useConfigContext = () => {
  const { config } = useContext<EditorContext>(EditorContext);

  return config;
}

export const useValueContext = () => {
  const { value } = useContext<EditorContext>(EditorContext);

  return value;
}
