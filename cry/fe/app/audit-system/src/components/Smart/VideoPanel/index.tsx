/**
 * 视频模板 视频安审 | 视频分类标注 | 视频质量标注
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'dva';
import Player from 'xgplayer';
import moment from 'moment';
import { message, Popover, Skeleton, Modal, Row, Col } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';
import { antiFrandResultItemType, imgAntiFrandResultType, imgAntiFrandResult } from '@/components/BusinessLogic/antiFrandResult';

import { ConnectState, UserModelState } from '@/models/connect';
import { screenShot } from '@/services/videoReview';

import './index.less';

type fpsTypes = 'imgSrc' | 'secTime';
/**
 * 抽帧图片src
 * 图片上显示分钟数
 * 点击时间跳转视频时间
 * 图片机审结果处理
 */
interface FPSProps extends Record<fpsTypes, string> {
  time: number; // 点击时间跳转视频时间
  antiFrandResult: imgAntiFrandResultType; // 数美图片审核结果
}

// realVideoUrl 是视频可以播放的地址 因为可能存在403 所以调用了服务端接口来转换可以播放的视频链接获取key
// sourceUrl 是原始数据吐给的url
interface videoPanelProps {
  realVideoUrl?: string;
  sourceUrl?: string;
  antiFrandResult: Array<antiFrandResultItemType>;
  myKey?: string; // dstVideoKey | ks3Key | ''
}

const VideoPanel: React.FC<videoPanelProps> = ({ realVideoUrl, sourceUrl, antiFrandResult, myKey }) => {
  const { collapsed } = useSelector<ConnectState, UserModelState>(state => state?.user);

  const [screenShotPic, setScreenShotPic] = useState<Array<FPSProps>>([]);
  const [videoPlayer, setVideoPlayer] = useState<any>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const observerRate = () => {
    var ele = document.querySelector('video[mediatype="video"]')!;
    ele?.addEventListener('ratechange', (event: any) => {
      localStorage.setItem('palyRate', event?.target?.playbackRate || 1);
    });
  };

  const initvp = () => {
    if (realVideoUrl) {
      // 初始化视频实例
      const videoPlayer = new Player({
        id: 'wrapper',
        download: true,
        url: realVideoUrl,
        playbackRate: [1, 1.5, 2, 3, 5],
        defaultPlaybackRate: localStorage.palyRate ? Number(localStorage.palyRate) : 1,
        videoInit: true,
        fluid: true,
      });
      setVideoPlayer(videoPlayer);
      videoPlayer.once('complete', observerRate);
    }
  };

  // 截取方式 从最后一个mp4往前截取，如果url中存在_h265_的话，就截取到倒数第二个_;如果不存在_h265_的话，就截取到倒数第一个_
  const getVideoKey = () => {
    // 顺序 dstVideoKey | ks3Key | sourceUrl.includes('?key=') ? [sourceUrl.split('?key=')[1]] : [getVideoKey()],
    const url: string = sourceUrl ?? '';
    if (myKey) {
      return myKey;
    }

    if (url.includes('?key=')) {
      return url.split('?key=')[1];
    }
    
    const normalUrl = url
      .substring(0, url.indexOf('_', url.indexOf('.', url.lastIndexOf('/'))) & 0x7fffffff)
      .replace(/(?:https?:\/\/)[^/]+?\w+\//, '');

    if (url.includes('malasong/')) {
      return normalUrl.replace('_bd.mp4', '');
    } else {
      return normalUrl;
    }
  };

  // 抽帧需要用原来的视频地址 videoUrl，可以播放的地址是经过转换的
  const setScreenShot = () => {
    if (!sourceUrl) {
      // message.warning(`视频url不存在！`);
      return false;
    }
    
    // 抽帧 有key的话用key后面的没有的话按照正则匹配
    const params = {
      keys: [getVideoKey()],
      task_id: 'blizzardVideoScreen',
    };

    if (params.keys.length) {
      screenShot(params)
        .then(res => {
          const { status, data } = res;
          if (status === 'success') {
            // 按照最后一帧拼接全部抽帧图片
            const SPLIT_STR = '.mp4/';
            // 截取图片url和最后一帧图片名【图片名是以帧数命名的】
            // image_loop字段，值为3时说明此视频的抽帧为一秒一帧，
            // 取抽帧时需要步长*3，若没有此字段，则为3秒一帧
            const { image_loop } = data[params.keys[0]];
            const [imgUrl, count] = data[params.keys[0]].images?.split(SPLIT_STR);
            const FPS: number = image_loop || 3;
            const PADDING_LEN: number = 3;
            // 截取图片后缀jpg jpeg等
            let [imgsLen, pname] = count.split('.');
            let imgs: Array<FPSProps> = [];
            let str: string = '';
            for (let i = 1; i <= imgsLen; i++) {
              if (i % FPS === 0) {
                // 只有100一下的才需要拼接 要处理为001、002的固定格式
                str = `${i}`.length < PADDING_LEN ? `${i}`.padStart(PADDING_LEN, '0') : `${i}`;
                const imgSrc = `${imgUrl}${SPLIT_STR}${str}.${pname}`;
                const imageAntiFrandResult = imgAntiFrandResult(imgSrc, antiFrandResult);
                imgs.push({
                  imgSrc,
                  secTime: moment.utc(i * 1000).format('HH:mm:ss'),
                  time: i,
                  antiFrandResult: imageAntiFrandResult,
                });
              }
            }
            setScreenShotPic(imgs);
          } else {
            message.error('视频抽帧失败');
          }
        })
        .catch(err => {
          console.log('err', err);
          message.error('视频抽帧出错', err);
        });
    } else {
      message.error(`视频url: ${sourceUrl} 不符合抽帧条件!`, 5);
    }
  };

  const setVideoTime = (time: number) => {
    videoPlayer.currentTime = time;
  };

  // 渲染图片
  const Image: React.FC<{ url: string; isPreview: boolean }> = ({ url, isPreview }) => (
    <img loading="lazy" className={isPreview ? '' : 'sc-img'} width={isPreview ? 200 : 136} src={url} alt="视频截图" />
  );

  // 渲染抽帧图片
  const renderImg = (isPreview: boolean = false) => {
    return screenShotPic.map((item: FPSProps, index: number) => {
      const { needTips = false, tips = '' } = item.antiFrandResult;
      const imageProps = {
        url: item.imgSrc,
        isPreview,
      };
      return (
        <div className="pic-box" key={index}>
          {
            <div
              className={`img-x cp ${needTips ? 'danger-border' : ''}`}
              onClick={() => {
                !isPreview && setVideoTime(item.time);
              }}
            >
              <Popover placement="left" content={<Image {...imageProps} />}>
                {needTips && (
                  <Popover placement="right" title="机审信息" content={tips}>
                    <div className="tips-icon-wrapper">
                      <Iconfont name="iconjinggao" />
                    </div>
                  </Popover>
                )}
                <Image {...imageProps} />
              </Popover>
            </div>
          }
          <div className="cover-x">{item.secTime}</div>
        </div>
      );
    });
  };

  useEffect(() => {
    if (realVideoUrl) {
      // 必须重新实例化，否则会有上次的实例音频未被清除
      setVideoPlayer(null);
      initvp();
      setScreenShot();
    }
  }, [realVideoUrl]);

  return (
    <>
      <div className={`video-content fb ${collapsed ? 'height-75' : 'height-69'}`}>
        <div className="video-left">
          <h3>视频</h3>
          <div id="wrapper"></div>
          {/* <Affix target={() => document?.querySelector(`[class="scroll-panel"]`) as HTMLElement}>
          </Affix> */}
        </div>
        <div className="video-right fb f1">
          <Row style={{ width: '100%', marginBottom: 10 }}>
            <Col span={12}>帧预览</Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <span className="cp" onClick={screenShotPic.length ? () => setVisible(true) : () => {}}>
                全屏展示
              </span>
            </Col>
          </Row>
          <div className="img-content">{!screenShotPic.length ? <Skeleton active /> : renderImg(false)}</div>
        </div>
      </div>
      <Modal title="图片预览" visible={visible} footer={null} onCancel={() => setVisible(false)} width={1200}>
        <div className="video-right fb f1">{!screenShotPic.length ? <Skeleton active /> : renderImg(true)}</div>
      </Modal>
    </>
  );
};

export default VideoPanel;
