import React from 'react';
import {Row, Button, InputNumber, Col} from 'antd';
interface ArticleProps{
  children?: React.ReactNode
  article: DOC
  index: number
  onTop?: () => void
  onCancelTop?: () => void
  onSort?: (index: number) => void
  onDelete?: () => void
  // onUpdate?: () => void
  onRecorver?: () => void
}

function jumpToIFrame (event: any, url: any, docid: any) {
  event.preventDefault()
  document.querySelector('#ifr-article')!['src'] = url
  document.querySelector('.ifr-docid')!.innerHTML = docid
}

const Article: React.FC<ArticleProps> = ({index, article, onTop, onSort, onDelete, onRecorver, onCancelTop}) => {
  const _onTop = () => {
    onTop && onTop();
  }
  const _onSort = (e: any) => {
    onSort && onSort(e.target.value);
  }
  // const _onUpdate = () => {
  //   onUpdate && onUpdate();
  // }
  const _onDelete = () => {
    onDelete && onDelete();
  }
  const _onRecorver = () => {
    onRecorver && onRecorver();
  }
  const _onCancelTop = () => {
    onCancelTop && onCancelTop();
  }

  return(
    <>
      <div>
        <Row>
          <a
            href={`http://pandora.yidian-inc.com/article/${article.docid}?hl=1`}
            target='ifr-article'
            onClick={(e) => jumpToIFrame(e, `http://pandora.yidian-inc.com/article/${article.docid}?hl=1`, article.docid)}
          >
            {`${index + 1} ${article.title}`} <span style={{color: 'red', marginLeft: '20px'}}>{article.removed ? '内容已删除' : null}</span>
          </a>
        </Row>
        <Row gutter={10} style={{marginBottom: '10px', marginTop: '10px'}}>
          <Col span={7}>
            {article.docid}
          </Col>
          <Col span={17}>
            {article.date}
          </Col>
        </Row>
        <Row>
          {/* 置顶 */}
          {
            onSort ?
            <>
              <InputNumber size="small" style={{width: 50, marginRight: 10}} min={1} onPressEnter={_onSort}/>
              <Button size="small" onClick={_onCancelTop} style={{marginRight: 10}}>取消置顶</Button>
            </> : null
          }
          {/* 非置顶 */}
          {
            onTop ?
            <>
              <Button size="small" disabled={article.removed} onClick={_onTop} style={{marginRight: 10}}>置顶</Button>
              <Button size="small" disabled={article.removed} onClick={_onDelete} style={{marginRight: 10}}>删除</Button>
              {
                article.removed && <Button size="small" onClick={_onRecorver} style={{marginRight: 10}}>恢复</Button>
              }
            </> : null
          }
          {/* <Button size="small">封面图</Button> */}
        </Row>
      </div>
    </>
  );
}

export default Article;
