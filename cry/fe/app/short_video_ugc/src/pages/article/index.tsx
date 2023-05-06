import React, { useState, useEffect } from 'react';
import {Button, Divider, message, Spin} from 'antd';
import { connect } from 'dva';
import {Dispatch} from '@/models/connect'
import {DocState} from './models/doc';
import Article from './component/article';
import ArticleModal from './component/articleModal';
import "./index.less"
import { operateDocByCppApi } from '@/services/doc';

interface ArticleProps {
  docState: DocState,
  dispatch: Dispatch,
  location: any
}
const Articles: React.FC<ArticleProps> = ({docState, dispatch, location})=>{
  // 参数
  const talk_id = location.query.id;
  const talk_name = location.query.name;
  const isDirty = docState.isDirty;
  const [selectArticle, setSelectArticle] = useState<DOC[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<DOC[]>([]);
  const [showArticleModal, setShowArticleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(()=> {
    getDocs('sticky'); // 置顶
    getDocs('normal'); // 非置顶
  },[talk_id]);

  useEffect(()=> {
    if(isDirty){
      setLoading(true);
      setTimeout(() => { // 后端不能及时返回
        getDocs('sticky');
        getDocs('normal'); // 非置顶
      }, 2000);
    }
  }, [isDirty]);

  const getDocs = async (type: string)=> {
    setLoading(true);
    const {status, result, reason} = await  dispatch({
      type: 'doc/getDocs',
      payload: {
        type,
        talk_id,
        num: 100,
      }
    });
    if(status === 'failed'){
      message.error(`数据加载失败!${reason}`);
    }
    if(status === 'success'){
      if(type === 'sticky'){
        setSelectedArticle([...result]);
      }
      if(type === 'normal'){
        setSelectArticle([...result]);
      }
    }
    setLoading(false);
  }

  const articleExists = (article: DOC): boolean => {
    return selectedArticle.find((item: DOC) => item.docid === article.docid) !== undefined;
  }
  const onTop = async (index: number) => {
    if(articleExists(selectArticle[index])){
      return message.info("请勿重复添加!");
    }
    onTopSortCallback(index);
  }
  const onSort = (target: number, index: number) => {
    // console.log(index, 'sss');
    if(target >= selectedArticle.length){
      target = selectedArticle.length;
    }
    onTopSortCallback(index, target);
  }
  const onTopSortCallback = async (index: number, target?: number) => {
    const payload = {
      talk_id,
      docid: selectArticle[index] && selectArticle[index].docid,
    };
    if(target || target !== undefined){
      payload['idx'] = target
      payload['docid'] = selectedArticle[index].docid;
    }
    const {status, reason} = await dispatch({
      type: 'doc/docSticky',
      payload,
    });
    if(status === 'failed'){
      message.error(`操作失败, ${reason}`);
      return;
    }
  }

  // 更新按钮
  const onUpdate = async (index: number, type?: string) => {
    // if(type === 'selected') { // 取消置顶文章
    //   const {status, reason} = await dispatch({
    //     type: 'doc/docUnSticky',
    //     payload: {
    //       talk_id,
    //       docid: selectedArticle[index].docid
    //     }
    //   });
    //   if(status === 'failed'){
    //     message.error(`操作失败, ${reason}`);
    //   }
    //   return;
    // }
    // // 删除文章
    // const { status } = await dispatch({
    //   type: 'doc/saveDocToTopic',
    //   payload: {
    //     params: {
    //       docid: selectArticle[index].docid,
    //     },
    //     data: {
    //       talk_id: 0,
    //       talk_name,
    //     }
    //   }
    // });
    // if(status === 'success'){
    //   message.success('操作成功!');
    // }else {
    //   message.error('操作失败, 请稍后重试!');
    // }
  }

  const operateDoc = (docid: string, type: string) => {
    operateDocByCppApi(docid, type).then(res => {
      if(res === true) {
        message.success('操作成功!');
        getDocs('normal')
      }else {
        message.error('操作失败, 请稍后重试!');
      }
    }).catch(err => {
      console.log('err', err);
    })
  }

  // 真正的删除按钮
  const onDelete = (docid: string) => {
    operateDoc(docid, 'delete_doc')
  }
  // 恢复ugc
  const onRecorver = (docid: string) => {
    operateDoc(docid, 'recover_doc')
  }
  // 取消置顶
  const onCancelTop = async (docid: string, talk_id: number) => {
    const {status, reason} = await dispatch({
      type: 'doc/docUnSticky',
      payload: {
        talk_id,
        docid
      }
    });
    if(status === 'success'){
      message.success('操作成功!');
    }else {
      message.error('操作失败, 请稍后重试!');
    }
  }

  return (
    <>
      <div className="main-content" style={{margin: 8}}>
        <Spin spinning={loading} tip='loading'>
          <div className="article-main-content">
            <div>
              <Button type="primary" icon="plus" size="small" onClick={() => setShowArticleModal(true)}>添加文章</Button>
              <Divider>
                <span style={{fontSize: 10}}>待置顶文章列表</span>
              </Divider>
              {selectArticle.map((article: DOC, index: number) => {
                const temp = [
                  <Article
                    key={index}
                    article={article}
                    onTop={() => onTop(index)}
                    // onUpdate={() => onUpdate(index)}
                    onDelete={() => onDelete(article.docid)}
                    onRecorver={() => onRecorver(article.docid)}
                    index = {index}
                  />,
                ];
                if(index < selectArticle.length -1) {
                  temp.push(<Divider dashed key={`divider${index}`}></Divider>)
                }
                return temp;
              })}
            </div>
            <div>
              <Divider>
                <span style={{fontSize: 10}}>置顶文章列表</span>
              </Divider>
              {selectedArticle.map((article: DOC, index: number)=>{
                const temp = [
                  <Article
                    index={index}
                    key={index}
                    article={article}
                    onSort={(target: number) => onSort(target, index)}
                    // onUpdate={() => onUpdate(index, 'selected')}
                    onRecorver={() => onRecorver(article.docid)}
                    onCancelTop={() => onCancelTop(article.docid, article.talk_id)}
                  />,
                ];
                if(index < selectedArticle.length -1) {
                  temp.push(<Divider dashed key={`divider${index}`}></Divider>)
                }
                return temp;
              })}
            </div>
            <div className="content doc-preview">
              <Divider>
                <span style={{fontSize: 12, color: 'red'}}>点击文章标题可在此栏预览</span>
              </Divider>
              <p className="ifr-docid"></p>
              <iframe title="doc preview iframe" id="ifr-article" name="ifr-article" allowFullScreen={true}/>
            </div>
            <ArticleModal
              visible = {showArticleModal}
              onCancel = {setShowArticleModal}
              id= {talk_id}
              name= {talk_name}
            />
          </div>
        </Spin>
      </div>
    </>
  );
}

export default connect(({doc: docState}: any)=>({
  docState
}))(Articles);
