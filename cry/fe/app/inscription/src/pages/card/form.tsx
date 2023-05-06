import React from 'react';

import { Card, Divider, Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { useRef, useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { CForm, YModal, YIcon } from '@/components';
import { useModeContext } from "@/hooks";

import { CardForm } from "@/types/card";
import { FORM_TEMP, FORM_CONTENT, FORM_STYLE, FORM_ACTIONS, FORM_CHILDS, defaultCards } from '@/config/card.config';
import { postCard } from "@/services/card";

const CardForm: React.FC = () => {
  const cardform = useForm();
	const history = useHistory();
	const dispatch = useDispatch();
	const routeParam = useParams<{id: string}>();	
	const commitRef = useRef<HTMLInputElement>(null);
	const modeContext = useModeContext();

  const [showCommit, setShowCommit] = useState<boolean>(false);
	const [showConfirm, setShowConfirm] = useState<boolean>(false);
	const [isNew, setIsNew] = useState<boolean>(true);
	const [cardstore, setCardStore] = useState<CardForm>(defaultCards);

	const temp = cardform.watch(FORM_TEMP);
	const mode = modeContext.mode;

  const handleCardSubmit = useCallback(() => {

	}, []);

  // 跳转指定列表
  const handleConfirmTo = (path: string) => {
    setShowConfirm(false);

    dispatch({
      type: 'card/updatecard',
      payload: { card: defaultCards },
    });
    dispatch({
      type: 'card/updatedoc',
      payload: {},
    });

    history.push(path);
  };

  // 确认提交
  const handleCommitConfirm = useCallback(() => {
    setShowCommit(false);

    if (!commitRef.current) {
      return dispatch({
        type: 'common/message',
        payload: { type: 'error', message: '未能获取到表单节点' },
      });
    }

    commitRef.current.click();
  }, [commitRef]);

  // confirm之后的取消，区分从新建之后的保存和修改之后的保存
  const handleConfirmCancel = () => {
    setShowConfirm(false);

    if (isNew && cardstore.card_id) {
      history.push(`/card/${cardstore.card_id}`);
    }
	};

	// 提交卡片
	const submitCardStore =async ()=> {

	};
	
	useEffect(()=> {
		setIsNew(routeParam.id === "new");
	}, [])

  return (
    <FormProvider {...cardform}>
      <h3>卡片管理/新建卡片</h3>
      <Card className="cardform form" type="inner">
        <CForm className="cardform-form" submitRef={commitRef} onSubmit={handleCardSubmit}>
          <section>
						
					</section>
          <Divider />
          {temp ? <>{/* 内容配置 */}</> : null}
          <section className="cardform-form-operation">
            <Button className="item" size="small" onClick={() => handleConfirmTo('/card')}>
              返 回
            </Button>
            <YModal // 套娃
              className="item"
              type="modal"
              label="提 交"
              showModal={showCommit}
              onShowModal={() => setShowCommit(true)}
              onCloseModal={() => setShowCommit(false)}
              buttonProps={{ type: 'primary' }}
              content="是否要提交该卡片配置?"
              modalProps={{
                title: '提交新建卡片',
                footer: (
                  <>
                    <Button size="small" onClick={() => setShowCommit(false)}>
                      取 消
                    </Button>
                    <YModal
                      type="modal"
                      label="提 交"
                      showModal={showConfirm}
                      onShowModal={handleCommitConfirm}
                      onCloseModal={() => setShowConfirm(false)}
                      buttonProps={{ type: 'primary' }}
                      modalProps={{
                        title: '提交新建卡片',
                        maskClosable: false,
                        footer: (
                          <>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleConfirmTo(`/launch/new?card=${cardstore.card_id}`)}
                            >
                              去投放
                            </Button>
                            <Button size="small" onClick={() => handleConfirmTo('/card')}>
                              返回列表
                            </Button>
                            <Button size="small" onClick={handleConfirmCancel}>
                              取消
                            </Button>
                          </>
                        ),
                      }}
                      content={
                        <>
                          <p>
                            <YIcon type="checked" />
                            <span>卡片配置已提交</span>
                          </p>
                          <p>{`本次提交的卡片ID: ${cardstore?.card_id}`}</p>
                        </>
                      }
                    />
                  </>
                ),
              }}
            />
          </section>
        </CForm>
      </Card>
    </FormProvider>
  );
};

export default React.memo(CardForm);
