import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { Card, Divider, Button } from 'antd';
import { connect, useDispatch, useSelector, Dispatch } from 'dva';

import { YModal, YIcon, CForm } from '@/components';
import { useModeContext, useRoute } from '@/hooks';
import { parseRecord, reparseCard, isEmpty } from '@/utils';

import { FORM_TEMP, FORM_CONTENT, FORM_STYLE, FORM_ACTIONS, FORM_CHILDS, defaultCards } from '@/config/card.config';
import { CardBasic, StyleWithLabel, CardAction, CardActionMore } from '@/pages/cards/forms';
import { ContentWithTopitem, ContentWithCover, ContentWithSummary, ContentWithIcon } from '@/pages/cards/forms';
import { CardChild, ContentEmpty, ContentWithTitle } from '@/pages/cards/forms';
import { CardForm, DocInfo } from '@/types/card';
import { ConnectState, YAnyAction } from '@/types/connect';

import './index.less';

const CardForm: React.FC<any> = (props) => {
  const { history, params } = useRoute();
  const { mode } = useModeContext();

  const commitRef = useRef<HTMLInputElement>(null);
  const cardform = useForm<CardForm>({ defaultValues: defaultCards });

  const dispatch = useDispatch<Dispatch<YAnyAction>>();
  const cardstore = useSelector<ConnectState, CardForm>(state => state.card.cardstore);
  const docinfo = useSelector<ConnectState, Record<string, DocInfo>>(state => state.card.docinfo);

  const [showCommit, setShowCommit] = useState<boolean>(false); // 提交确认
  const [showConfirm, setShowConfirm] = useState<boolean>(false); // 提交投放

  const cardId = params.id;
  const isnew = cardId === 'new';

  const temp = cardform.watch(FORM_TEMP);

  const getCardId = (card: CardForm, cardsToDelete: Array<number> = []): Array<number> => {
    if (!card.card_id) {
      return cardsToDelete;
    }

    cardsToDelete.push(card.card_id);

    if (isEmpty(card.card_items) === false) {
      for (let item of card.card_items as CardForm[]) {
        getCardId(item, cardsToDelete);
      }
    }
    return cardsToDelete;
  };

  // 会出现待删除的id不全的场景
  const getDeleteCard = (postdata: CardForm) => {
    const originCardIds = getCardId(cardstore);
    const postCardIds = getCardId(postdata);
    const cardsToDelete: Array<number> = [];

    for (let id of originCardIds) {
      if (postCardIds.includes(id) === false) {
        cardsToDelete.push(id);
      }
    }

    return cardsToDelete;
  };

  // 提交按钮, 有一个数据校验
  const handleCardSubmit = (data: Record<string, any>) => {
    const postData = parseRecord(data) as CardForm;
    const cardsToDelete = getDeleteCard(postData);

    console.log(postData, 'postdata');

    if (Object.entries(postData).length === 0) {
      dispatch({
        type: 'common/message',
        payload: { type: 'error', message: '卡片数据不能为空' },
      });
      return void 0;
    }

    dispatch({
      type: 'card/postcard',
      payload: { mode, card: postData, deleteCards: cardsToDelete, isnew },
      callback: () => setShowConfirm(true),
    });
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

  // confirm之后的取消，区分从新建之后的保存和修改之后的保存
  const handleConfirmCancel = () => {
    setShowConfirm(false);

    if (isnew && cardstore.card_id) {
      history.push(`/card/${cardstore.card_id}`);
    }
  };

  const handleQueryDoc = (docid?: string) => {
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

  // 根据路由信息判定是否需要去获取数据
  useEffect(() => {
    if (isnew) {
      return;
    }
    dispatch({
      type: 'card/fetchcard',
      payload: { card_id: cardId, mode },
    });
  }, [isnew, cardId, mode]);

  useEffect(() => {
    if (!cardstore) {
      return;
    }

    cardform.reset(reparseCard(cardstore, defaultCards));
  }, [cardstore]);

  return (
    <FormProvider {...cardform}>
      <h3>卡片管理/新建卡片</h3>
      <Card className="cardform form" type="inner">
        <CForm className="cardform-form" submitRef={commitRef} onSubmit={handleCardSubmit}>
          <section>
            <CardBasic form={cardform} />
          </section>
          <Divider />
          {temp ? (
            <>
              {/* 内容配置 */}
              {[1].includes(temp) ? <ContentWithCover name={FORM_CONTENT} /> : null}
              {[2].includes(temp) ? (
                <ContentWithTopitem form={cardform} name={FORM_CONTENT} docinfo={docinfo} onQueryDoc={handleQueryDoc} />
              ) : null}
              {[3].includes(temp) ? (
                <ContentWithSummary form={cardform} name={FORM_CONTENT} docinfo={docinfo} onQueryDoc={handleQueryDoc} />
              ) : null}
              {[4].includes(temp) ? <ContentEmpty name={FORM_CONTENT} /> : null/* 空白卡 */}
              {[1002].includes(temp) ? <ContentWithIcon name={FORM_CONTENT} form={cardform} /> : null}
              {[1003].includes(temp) ? <ContentWithTitle name={FORM_CONTENT} form={cardform} /> : null}

              {/* 样式配置 */}
              {[2, 3].includes(temp) ? <StyleWithLabel name={FORM_STYLE} /> : null}

              {/* 跳转配置 */}
              {[1, 2, 3].includes(temp) ? <CardAction name={FORM_ACTIONS} /> : null}
              {[1002, 1003].includes(temp) ? <CardActionMore name={FORM_ACTIONS} /> : null}

              {/*子卡片配置*/}
              {[1002, 1003].includes(temp) ? <CardChild name={FORM_CHILDS} parent={temp} /> : null}
            </>
          ) : null}
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

export default connect(({ user, card }: ConnectState) => {
  return { ...user, ...card };
})(React.memo(CardForm));
