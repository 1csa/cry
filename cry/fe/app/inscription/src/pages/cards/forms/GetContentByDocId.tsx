/**
 * 通过docid获取文章内容 标题 封面图 的组件封装
 */
import React, { useEffect } from 'react';
import { Button, Divider } from 'antd';
import { useFormContext } from 'react-hook-form';
import { connect, useDispatch, useSelector, Dispatch } from 'dva';
import { ConnectState, YAnyAction } from '@/types/connect';
import { FormItem, YInput, YUpload, YIcon } from '@/components';
import { useModeContext } from '@/hooks';
import { FORM_TOPITEM, FORM_COVER, FORM_MAIN } from '@/config/card.config';
import { DocInfo } from '@/types/card';

interface CardCover {
  name: string;
  // docinfo: Record<string, DocInfo>;
  // onQueryDoc: (docid: string) => void;
}

// 如果将业务写在这里，就会变成service和ui耦合
const CardCover: React.FC<CardCover> = ({ name }) => {
  const modeContext = useModeContext();
  const formContext = useFormContext();
  const docid = formContext.watch<string, string>(`${name}.${FORM_TOPITEM}`);
  const dispatch = useDispatch<Dispatch<YAnyAction>>();

  const mode = modeContext.mode;

  const docinfo = useSelector<ConnectState, Record<string, DocInfo>>(state => state.card.docinfo);

  const handleTitleChange = (value: string) => {
    // form.setValue(FORM_TITLE, value);
    formContext.setValue(`${name}.${FORM_MAIN}`, value);
  };

  useEffect(() => {
    if (!docinfo || !docid || !docinfo[docid]) {
      return void 0;
    }

    // form.setValue(`${name}.${FORM_TITLE}`, docinfo[docid].title);
    formContext.setValue(`${name}.${FORM_MAIN}`, docinfo[docid].title);
    formContext.setValue(`${name}.${FORM_COVER}`, docinfo[docid].image);
  }, [docinfo, docid]);

  const handleQueryDoc = () => {
    if (!docid) {
      return dispatch({
        type: 'common/error',
        payload: { type: 'error', message: '请输入docid' },
      });
    }
    dispatch({
      type: 'card/fetchdoc',
      payload: { docid, mode },
    });
  };

  return (
    <>
      <FormItem form label="内容ID" name={`${name}.${FORM_TOPITEM}`}>
        <YInput flex={true}>
          <Button size="small" icon={<YIcon type="search" />} type="primary" onClick={() => handleQueryDoc()}>
            获取文章
          </Button>
        </YInput>
      </FormItem>
      {/* <FormItem form label="内容标题" name={`${name}.${FORM_TITLE}`}> */}
      <FormItem form label="内容标题" name={`${name}.${FORM_MAIN}`}>
        <YInput onExtraChange={handleTitleChange} />
      </FormItem>
      <FormItem form label="封面图" name={`${name}.${FORM_COVER}`}>
        <YUpload haveLink={true}>
          <span />
        </YUpload>
      </FormItem>
      <Divider />
    </>
  );
};

export default connect(({ card }: ConnectState) => {
  return { ...card };
})(React.memo(CardCover));
