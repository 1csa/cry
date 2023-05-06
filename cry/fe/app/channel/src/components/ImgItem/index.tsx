import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Upload } from 'antd';
import {
  DiffOutlined,
  DeleteOutlined,
  ZoomInOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { setImages, updateDocImage, uploadImageOp } from '../../services/topNews.service';
import { topNewsDispatches } from '@/dispatches';
import { TopItemProps } from '@/config/topNews';
import { Dispatch, ConnectState, Callback } from '@/models/connect';
import { connect } from 'dva';
interface ImgList {
  url: string;
  thumbUrl: string;
  name: string;
  uid: string;
}

interface IImgItemProps {
  imageUrls: Array<string>;
  image: string;
  docid: string;
  index: number;
  doc: TopItemProps;
  updateTopItem: (index: number, topItem: TopItemProps) => void;
}

const ImgItem: React.FC<IImgItemProps> = ({
  imageUrls,
  image,
  docid,
  index,
  updateTopItem,
  doc,
}) => {
  const [showImgOp, setShowImgOp] = useState<object>({}); // 鼠标移入是否展示编辑选项
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // 放大展示判断
  const [previewImg, setPreviewImg] = useState<string>(''); // 放大的图片url
  const [imgArr, setImgArr] = useState<Array<string>>([]); // imgurl数组
  const [uploadIndex, setUploadIndex] = useState<number>(-1); // upload 数组顺序
  const [fileList, setFileList] = useState<Array<any>>([]); //

  useEffect(() => {
    setImgArr(imageUrls);
  }, [imageUrls]);

  const imgList = (): Array<ImgList> => {
    let imgListTemp =
      ((imageUrls && imageUrls) || (image ? [image] : [])).map((item, index) => ({
        // url: `http://i1.go2yd.com/image/${item}?type=thumbnail_90x60`, //原图
        url: `https://i1.go2yd.com/image.php?url=${item}&type=thumbnail_90x60`, //原图
        thumbUrl: `https://i1.go2yd.com/image.php?url=${item}`, //缩略图
        uid: docid,
        name: item,
      })) || [];
    return imgListTemp;
  };

  useEffect(() => {
    setFileList(imgList());
  }, [imageUrls, image, docid]);

  const handleMouseOver = (name: number) => {
    let temp = { ...showImgOp };
    temp[name] = true;
    setShowImgOp(temp);
  };

  const handleMouseLeave = (name: number) => {
    let temp = { ...showImgOp };
    temp[name] = false;
    setShowImgOp(temp);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handlePreview = (url: string) => {
    setPreviewVisible(true);
    setPreviewImg(url);
  };

  const handleReplace = (index: number) => {
    setUploadIndex(index);
    let inputDom: Element = document.querySelector(`#upload-input-${docid}`) as Element;
    inputDom.click();
  };

  const uploadButton = (
    <div
      onClick={() => {
        handleReplace(-1);
      }}
      style={{
        position: 'relative',
        width: 90,
        height: 60,
        border: '1px dashed #129aee',
        textAlign: 'center',
        cursor: 'pointer',
        paddingTop: '7px',
        marginTop: '5px',
        marginRight: '10px',
      }}
    >
      <PlusSquareOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

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
        let imgItem = {
          // url: `http://i1.go2yd.com/image/${res.url}?type=thumbnail_90x60`,
          url: `https://i1.go2yd.com/image.php?url=${res.data.image_id}&type=thumbnail_90x60`,
          thumbUrl: res.data.url,
          name: res.data.url,
        };
        if (uploadIndex === -1) {
          imgArr.push(res.data.image_id);
          fileList.push(imgItem);
        } else {
          fileList.splice(uploadIndex, 1, imgItem);
          imgArr.splice(uploadIndex, 1, res.data.image_id);
        }
        setFileList(fileList.slice(0));
        setImgArr(imgArr);
        setImages({ docid, imageUrls: imgArr.join(), covertype: 'normal' });
        updateDocImage({ docid });
        let tempDoc = { ...doc };
        tempDoc = { ...doc, image_urls: imgArr };
        updateTopItem(index, tempDoc);
      }
    }, 0);
  };

  const handleRemoveImage = async (file: ImgList | string) => {
    let imgUrl = (file as ImgList).name;
    let filterList = fileList.filter(item => {
      return (item as ImgList).name !== (file as ImgList).name;
    });

    let indexImg = imgArr.indexOf(imgUrl);
    if (indexImg >= 0) {
      imgArr.splice(indexImg, 1);
    }
    setImgArr([...imgArr]);
    setFileList([...filterList]);
    setImages({ docid, imageUrls: imgArr.join(), covertype: 'normal' });
    updateDocImage({ docid });
    let tempDoc = { ...doc };
    tempDoc = { ...doc, image_urls: imgArr };
    updateTopItem(index, tempDoc);
  };

  const renderImg = imgList()
    .slice(0, 3)
    .map((item, index) => {
      return (
        <div
          key={(item as ImgList).name}
          className="img-item"
          style={{
            backgroundImage: `url("${(item as ImgList).url}")`,
            lineHeight: '60px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '16px',
            position: 'relative',
            width: 90,
            height: 60,
            marginRight: '10px',
            marginTop: '5px',
          }}
          onMouseOver={() => {
            handleMouseOver(index);
          }}
          onMouseLeave={() => {
            handleMouseLeave(index);
          }}
        >
          {showImgOp[index] ? (
            <div>
              <div
                style={{
                  position: `absolute`,
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 0, 0, .5)',
                }}
              ></div>
              <ZoomInOutlined
                onClick={() => {
                  handlePreview((item as ImgList).thumbUrl);
                }}
                style={{ position: 'relative', marginRight: '5px', cursor: 'pointer' }}
              />
              <DeleteOutlined
                onClick={() => {
                  handleRemoveImage(item);
                }}
                style={{ position: 'relative', marginRight: '5px', cursor: 'pointer' }}
              />
              <span style={{ position: 'relative', cursor: 'pointer' }}>
                <DiffOutlined
                  onClick={() => {
                    handleReplace(index);
                  }}
                  style={{ position: 'relative', marginRight: '5px', cursor: 'pointer' }}
                />
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
      );
    });

  return (
    <div className="image-info" style={{ marginBottom: '10px' }}>
      <div
        className="covers"
        style={{ marginTop: '5px', overflow: 'hidden', flexWrap: 'wrap', display: 'flex' }}
      >
        {renderImg}
        {imgList().length >= 3 ? null : uploadButton}
      </div>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '90%' }} src={previewImg} />
      </Modal>
      <input
        id={`upload-input-${docid}`}
        type="file"
        name="uploadimage"
        style={{ display: 'none' }}
        onChange={handleUploadChange}
      />
    </div>
  );
};

const mapDispatchesToProps = (dispatch: Dispatch) => ({
  updateTopItem: topNewsDispatches.updateTopItem(dispatch),
});

export default connect(null, mapDispatchesToProps)(ImgItem);
