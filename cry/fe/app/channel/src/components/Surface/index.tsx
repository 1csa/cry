import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Button, message, Radio, RadioChangeEvent, Tabs } from 'antd';
import Cropper from 'react-cropper';
import {
  DiffOutlined,
  DeleteOutlined,
  ZoomInOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import 'cropperjs/dist/cropper.css';
import './index.less';
import { connect } from 'dva';
import { RecItemProps } from '@/config/topNews';
import { topNewsDispatches } from '@/dispatches';
import { Dispatch } from '@/models/connect';
import {
  getArticlePic,
  uploadImageOp,
  setImages,
  updateDocImage,
} from '@/services/topNews.service';

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;

interface ISurfaceProps {
  itemData: RecItemProps;
  index: number;
  closeModal: () => void;
  updateRecItem: (index: number, recItem: RecItemProps) => void;
}

interface ShowImg {
  [key: string]: boolean;
}

const Surface: React.FC<ISurfaceProps> = ({ itemData, index, closeModal, updateRecItem }) => {
  const cropperRef = useRef<HTMLImageElement>(null);

  let [ratio, setRatio] = useState<number>(16 / 9); // 裁剪比例
  let [rotate, setRotate] = useState<number>(0); // 旋转角度
  let [curImageSrc, setCurImageSrc] = useState<string>(''); // 图片src
  let [showTopImgArr, setShowTopImgArr] = useState<ShowImg>({}); // 上方图片是否蒙层
  let [showLeftImgArr, setShowLeftImgArr] = useState<ShowImg>({}); // 左侧图片是否蒙层
  let [tab, setTab] = useState<string>('tab1'); // 切换tab的key
  let [imgTopArr, setImgTopArr] = useState<Array<string>>([]); // images 是 封面图组件 上面的图 接口里的
  let [imgLeftVArr, setImgLeftVArr] = useState<Array<string>>([]); // uploadImagesV 是 封面图组件 左侧 副封面图的图 接口里的
  let [mainImg, setMainImg] = useState<Array<string>>([]); // 主封面图 imageurl中的数组
  const { docid, image_urls } = itemData;
  useEffect(() => {
    /**
     * 请求接口
     */
    getArticlePic(docid).then(res => {
      let tempCoverMap = {};
      let showImagesMap = { ...showTopImgArr };
      // 默认图片蒙层不显示
      res.images.forEach((v: string) => {
        showImagesMap[v] = false;
      });
      image_urls &&
        image_urls.forEach(v => {
          tempCoverMap[v] = false;
        });
      setShowTopImgArr(showImagesMap);
      setShowLeftImgArr(tempCoverMap);
      setMainImg((image_urls && image_urls.slice(0)) || []);

      let src = `http://i1.go2yd.com/image/${(image_urls && image_urls[0]) ||
        (res.images && res.images[0]) ||
        ''}`;
      setCurImageSrc(src);

      if (res.images && res.images.length > 0) {
        setImgTopArr((res.images && res.images.slice(0)) || []);
      } else {
        setImgTopArr([]);
      }
      if (res.uploadImagesV && res.uploadImagesV.length > 0) {
        setImgLeftVArr((res.uploadImagesV && res.uploadImagesV.slice(0)) || []);
      } else {
        setImgLeftVArr([]);
      }
    });
  }, []);

  /**
   * 下面四个是 鼠标事件回调
   * @param item 对应docid
   */
  const handleMouseOver = (item: string) => {
    let temp = { ...showTopImgArr };
    temp[item] = true;
    setShowTopImgArr(temp);
  };
  const handleMouseLeave = (item: string) => {
    let temp = { ...showTopImgArr };
    temp[item] = false;
    setShowTopImgArr(temp);
  };
  const handleMouseOverCover = (item: string) => {
    let temp = { ...showLeftImgArr };
    temp[item] = true;
    setShowLeftImgArr(temp);
  };
  const handleMouseLeaveCover = (item: string) => {
    let temp = { ...showLeftImgArr };
    temp[item] = false;
    setShowLeftImgArr(temp);
  };

  /**
   * 点击上面的图 添加到左侧封面图
   */
  const handleAddToCovers = (item: string) => {
    let newCovers = tab === 'tab1' ? mainImg.slice(0) : imgLeftVArr.slice(0);
    if (newCovers.length > 2) {
      message.success('最多可以添加三张封面图!');
    } else {
      newCovers.push(item);
    }
    if (tab === 'tab1') {
      setMainImg(newCovers);
    } else {
      setImgLeftVArr(newCovers);
    }
  };

  /**
   *  图片放到裁剪板中
   * @param item docid
   */
  const handleEdit = (item: string) => {
    setCurImageSrc(`https://i1.go2yd.com/image.php?url=${item}`);
  };

  const handleRemoveImage = (item: string, index: number, key: string, list: Array<string>) => {
    let newCovers = list.slice(0);
    newCovers.splice(index, 1);

    if (key === 'tab1') {
      setMainImg(newCovers);
    } else {
      setImgLeftVArr(newCovers);
    }
  };

  /**
   * 改变上下顺序
   * @param index
   * @param key
   * @param list
   * @returns
   */
  const handleArrowUpImg = (index: number, key: string, list: Array<string>) => {
    if (index === 0) {
      return;
    } else {
      let newCovers = [...mainImg];
      let temp = newCovers[index - 1];
      newCovers[index - 1] = newCovers[index];
      newCovers[index] = temp;
      if (key === 'tab1') {
        setMainImg(newCovers);
      } else {
        setImgLeftVArr(newCovers);
      }
    }
  };

  /**
   * 改变上下顺序
   * @param index
   * @param key
   * @param list
   * @returns
   */
  const handleArrowDownImg = (index: number, key: string, list: Array<string>) => {
    if (index === mainImg.length) {
      return;
    } else {
      let newCovers = [...mainImg];
      let temp = newCovers[index];
      newCovers[index] = newCovers[index + 1];
      newCovers[index + 1] = temp;
      if (key === 'tab1') {
        setMainImg(newCovers);
      } else {
        setImgLeftVArr(newCovers);
      }
    }
  };

  /**
   * 上传图片
   * @param e
   */
  const handleUploadChange = async (e: any) => {
    let target = e.target;
    setTimeout(async () => {
      let formData = new FormData();
      let file = target.files[0];
      if (!file) {
        return;
      }
      formData.append('file', file);

      let res = await uploadImageOp(formData);
      if (res.status === 'success') {
        setCurImageSrc(res.data.url);
      }
    }, 0);
  };

  /**
   * 选择比例
   */
  const handleRatioChange = (e: RadioChangeEvent) => {
    let ratioMap = {
      '3:2': 3 / 2,
      '16:9': 16 / 9,
      '2:1': 2 / 1,
      '9:16': 9 / 16,
    };
    let _ratio = e.target.value || '16:9';
    setRatio(ratioMap[_ratio]);
  };
  /**
   * 当比例改变时触发cropper里面的方法改变框的比例
   */
  useEffect(() => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (typeof ratio === 'number') {
      cropper.setAspectRatio(ratio);
    }
  }, [ratio]);

  /**
   * 旋转
   */
  const handleRotateTo = () => {
    if (rotate === 360) {
      rotate = 90;
    } else {
      rotate += 90;
    }
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    cropper.rotateTo(rotate);
    setRotate(rotate);
  };

  /**
   * 上传
   */
  const handleUpload = () => {
    let inputDom: Element = document.querySelector(`#upload-cropper-${docid}`) as Element;
    //@ts-ignore
    inputDom.click();
  };

  /**
   * 裁剪
   */
  const handleCropper = async () => {
    let newCovers = tab === 'tab1' ? mainImg.slice(0) : imgLeftVArr.slice(0);
    if (newCovers.length > 2) {
      message.success('最多可以添加三张封面图!');
    }
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const formData = new FormData();
    cropper.getCroppedCanvas().toBlob(async (blob: any) => {
      formData.append('file', blob, `file_${Date.now()}.jpg`); // 文件对象
      let res = await uploadImageOp(formData);
      if (res.status === 'success') {
        newCovers.push(res.data.image_id);
        if (tab === 'tab1') {
          setMainImg(newCovers);
        } else {
          setImgLeftVArr(newCovers);
        }
      }
    });
  };

  /**
   * 保存封面图
   */
  const handleSaveCover = () => {
    const docid = itemData.docid;
    updateDocImage({ docid }).then(() => {
      if (mainImg.length > 0) {
        setImages({
          docid,
          imageUrls: mainImg.map(img => `https://i1.go2yd.com/image.php?url=${img}`).join(),
          covertype: 'normal',
        });
      }
    });

    itemData = { ...itemData, image_urls: mainImg };
    updateRecItem(index, itemData);
    closeModal();
  };

  /**
   * 切换tab
   * @param key
   */
  const handleChangeTab = (key: string) => {
    setTab(key);
  };

  /**
   * @return 上方初始图片
   */

  let topImage = imgTopArr.map((item, index) => {
    return (
      <div
        className="topimg img"
        key={item + index}
        style={{
          backgroundImage: `url("http://i1.go2yd.com/image.php?url=${item}&news_id=${docid}&type=thumbnail_90x60")`,
        }}
        onMouseOver={() => {
          handleMouseOver(item);
        }}
        onMouseLeave={() => {
          handleMouseLeave(item);
        }}
      >
        {showTopImgArr[item] && (
          <div className="topimg-main">
            <div className="one" />
            <ZoomInOutlined
              onClick={() => {
                handleAddToCovers(item);
              }}
              className="icon"
            />
            <DiffOutlined
              onClick={() => {
                handleEdit(item);
              }}
              className="icon"
            />
          </div>
        )}
      </div>
    );
  });

  /**
   * @return 左侧图片
   */
  let coverImgItems = (key: string, imgList: Array<string>) =>
    imgList &&
    imgList.slice(0, 3).map((item, index) => {
      return (
        <div
          key={item + index}
          className="leftimg img"
          style={{
            backgroundImage: `url("http://i1.go2yd.com/image.php?url=${item}&news_id=${docid}")`,
          }}
          onMouseOver={() => {
            handleMouseOverCover(item);
          }}
          onMouseLeave={() => {
            handleMouseLeaveCover(item);
          }}
        >
          {showLeftImgArr[item] && (
            <div className="leftimg-main">
              <div className="one" />
              <ArrowUpOutlined
                onClick={() => {
                  handleArrowUpImg(index, key, imgList);
                }}
                type="arrow-up"
                className="icon"
              />
              <ArrowDownOutlined
                onClick={() => {
                  handleArrowDownImg(index, key, imgList);
                }}
                type="arrow-down"
                className="icon"
              />
              <DiffOutlined
                onClick={() => {
                  handleEdit(item);
                }}
                type="edit"
                className="icon"
              />
              <DeleteOutlined
                onClick={() => {
                  handleRemoveImage(item, index, key, imgList);
                }}
                type="delete"
                className="icon"
              />
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="surface">
      <div className="text1"> 文章原始图片列表 </div>
      <div className="initlist">{topImage}</div>

      <div className="left">
        <div className="leftcontent">
          <div className="leftcontent-text1">文章封面图列表</div>
          <Tabs type="card" onChange={handleChangeTab}>
            <TabPane tab="主" key="tab1">
              <div className="tab">{coverImgItems('tab1', mainImg)}</div>
            </TabPane>
            <TabPane tab="副" key="tab2">
              <div className="tab">{coverImgItems('tab2', imgLeftVArr)}</div>
            </TabPane>
          </Tabs>
          <div className="leftcontent-text2">一张或三张封面图</div>
        </div>
      </div>

      <div className="right">
        <div className="cropper-op">
          <RadioGroup onChange={handleRatioChange} name="radiogroup" defaultValue={'16:9'}>
            <Radio value={'3:2'}>3:2</Radio>
            <Radio value={'16:9'}>16:9(午报)</Radio>
            <Radio value={'2:1'}>2:1(大图)</Radio>
            <Radio value={'9:16'}>9:16</Radio>
          </RadioGroup>
          <Button onClick={handleRotateTo} size="small" type="primary">
            旋转
          </Button>
        </div>
        <Cropper
          ref={cropperRef}
          style={{ height: 330, width: '100%' }}
          aspectRatio={16 / 9}
          src={curImageSrc || ''}
          viewMode={1}
          crossOrigin={'anonymous'}
        />
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button onClick={handleUpload} size="small" type="primary" style={{ marginRight: 20 }}>
            上传本地图片
          </Button>
          <Button onClick={handleCropper} size="small" type="primary">
            确认裁剪
          </Button>
        </div>
      </div>

      <div className="save">
        <Button onClick={handleSaveCover} size="small" type="primary">
          保存
        </Button>
      </div>
      <input
        id={`upload-cropper-${docid}`}
        type="file"
        name="uploadimage"
        style={{ display: 'none' }}
        onChange={handleUploadChange}
      />
    </div>
  );
};

const mapDispatchesToProps = (dispatch: Dispatch) => ({
  updateRecItem: topNewsDispatches.updateRecItem(dispatch),
});
export default connect(null, mapDispatchesToProps)(Surface);
