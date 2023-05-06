import React, { useState, useRef, useMemo, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button, Modal, Checkbox, Upload, Divider, Slider, message, Row, Col } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useFormikContext, useField } from 'formik';

import { updatePushImage } from '@/services/editorpushService';
import { isEmpty, resolveImageUrl } from '@/utils';

import { useSelector } from 'dva';
import { articleInfoSelector } from '@/selectors/editorpush';
import './index.less';

interface ImageEditor {
  label: string;
  type: string; // 配图类型
  width: number;
  height: number;
  borderRadius?: number;
  image?: File | string;
  confirmRef: React.RefObject<Button> | null;
  onUploadSuccess: (img: string) => void;
}

interface ImgUrl {
  url: string;
  random: number;
}
interface ImageCutter {
  imgUrl: ImgUrl;
}

export const ImageEditor: React.FC<ImageEditor> = React.memo(
  ({ label, image = '', type, width, height, borderRadius = 0, confirmRef, onUploadSuccess }) => {
    const editorRef = useRef<AvatarEditor>(null);

    const [scale, setScale] = useState<number>(1);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleCropConfirm = () => {
      if (!editorRef.current) {
        return message.error('未获取到图片剪裁区域');
      }
      editorRef.current.getImageScaledToCanvas().toBlob(uploadImageByBlob, 'image/jpeg');
    };

    const uploadImageByBlob = async (blob: Blob | null) => {
      setUploading(true);

      try {
        if (!blob) {
          throw new Error('未获取到剪裁图片内容');
        }

        const formData = new FormData();
        formData.append('file', blob);
        const uploadRes = await updatePushImage(formData, type);

        if (uploadRes.status === 'success') {
          onUploadSuccess(uploadRes?.data?.url as string);
          message.success(`${label}裁剪成功`);
        } else {
          throw new Error(uploadRes.message);
        }
      } catch (err) {
        // @ts-ignore
        message.error(err.toString());
      } finally {
        setUploading(false);
      }
    };

    return (
      <>
        <AvatarEditor
          ref={editorRef}
          image={image}
          height={height}
          width={width}
          border={12}
          scale={scale}
          color={[216, 216, 216, 0.8]}
          rotate={0}
          borderRadius={borderRadius}
          crossOrigin="anonymous"
          style={{ height: `${height / 2}px`, width: `${width / 2}px` }}
        />
        <div className="cutter-editor-operation">
          <Slider disabled={!image} max={3} min={0.1} step={0.1} value={scale} onChange={value => setScale(value as number)} />
          <Button ref={confirmRef} disabled={!image} size="small" loading={uploading} onClick={handleCropConfirm}>
            裁剪
          </Button>
        </div>
      </>
    );
  },
);

// 图片
export const ImageCutter: React.FC<ImageCutter> = React.memo(({ imgUrl }) => {
  const formik = useFormikContext();
  const normalRef = useRef<Button>(null);
  const xiaomiRef = useRef<Button>(null);
  const oppoRef = useRef<Button>(null);
  const [_, { value: open_sectional }] = useField('open_sectional'); // 获取模版对应字段

  const [normalImg, setNormalImg] = useState<string>(''); // 每个图片url
  const [xiaomiImg, setXiaomiImg] = useState<string>(''); //同上
  const [oppoImg, setOppoImg] = useState<string>(''); // 同上

  const [normalcheck, setNormalcheck] = useState<boolean>(false); // 选中的checked值 通过checkbox更新state 关闭时需要清除为false 所以单独设个state
  const [xiaomicheck, setXiaomicheck] = useState<boolean>(false); // 同上
  const [oppocheck, setOppocheck] = useState<boolean>(false); // 同上

  const [allImage, setAllImage] = useState<Record<string, any>>({}); // 整个三张图state
  const [showModal, setShowModal] = useState<boolean>(false); // modal开关
  const [image, setImage] = useState<RcFile | string>(); // 单个图片url或者rcfile

  const articleInfo = useSelector(articleInfoSelector);

  useEffect(() => { //保证图片随时更新
    if (normalcheck) {
      setAllImage({ ...allImage, img: normalImg });
    }
    if (xiaomicheck) {
      setAllImage({ ...allImage, xiaomi_img_url: xiaomiImg });
    }
    if (oppocheck) {
      setAllImage({ ...allImage, oppo_push_notification_img_url: oppoImg });
    }
  }, [normalImg, xiaomiImg, oppoImg]);

  useEffect(() => {
    if (imgUrl?.url) {
      setShowModal(true);
      setImage(imgUrl.url);
    }
  }, [imgUrl]);

  const handleBeforeUpload = (file: RcFile) => {
    setImage(file);
    return false;
  };

  const hanldeCropAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (normalRef.current) {
      normalRef.current.handleClick(e);
    }

    if (xiaomiRef.current) {
      xiaomiRef.current.handleClick(e);
    }

    if (oppoRef.current) {
      oppoRef.current.handleClick(e);
    }
  };

  const handleCheckChange = (checked: boolean, name: string) => {
    if (name === 'normal') {
      setAllImage({ ...allImage, img: checked ? normalImg : undefined });
      setNormalcheck(checked);
    } else if (name === 'xiaomi') {
      setAllImage({ ...allImage, xiaomi_img_url: checked ? xiaomiImg : undefined });
      setXiaomicheck(checked);
    } else if (name === 'oppo') {
      setAllImage({ ...allImage, oppo_push_notification_img_url: checked ? oppoImg : undefined });
      setOppocheck(checked);
    }
  };

  const handleConfirmImage = () => {
    if (isEmpty(allImage)) {
      return message.error('未选择图片');
    }

    for (let key in allImage) {
      formik.setFieldValue(key, allImage[key]);
    }
    message.success('上传成功');
    setShowModal(false);
  };

  const renderImgUrl = useMemo(() => {
    // 渲染图片
    const { serving_status, image_urls, image } = articleInfo;

    let imageList: Array<string> = [];
    if (serving_status === true /* 未删除的文章 */) {
      if (image_urls && image_urls.length > 0) {
        imageList = image_urls.map((url: string) => resolveImageUrl(url)).concat(imageList);
      } else if (image) {
        imageList.unshift(resolveImageUrl(image));
      }
    }
    if (open_sectional) {
      return null;
    }

    if (imageList.length <= 0) {
      setImage('');
      setNormalcheck(false);
      setXiaomicheck(false);
      setOppocheck(false);
    }

    return imageList.map((url, index) => {
      return (
        <div
          key={index}
          onClick={() => {
            handleClickImg(url);
          }}
          className="cximg"
        >
          <img src={url} />
        </div>
      );
    });
  }, [articleInfo, open_sectional]);

  const handleClickImg = (url: string) => {
    setImage(url);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>上传&剪裁</Button>
      <Modal visible={showModal} closable={false} footer={null} width={1200} onCancel={() => setShowModal(false)}>
        <div className="cutter">
          <section className="cutter-picture">
            <Row>
              <Col>本地配图：</Col>
              <Col className="pic">{renderImgUrl}</Col>
            </Row>
          </section>
          <section className="cutter-operation">
            <Upload beforeUpload={handleBeforeUpload} accept="image/*">
              <Button>上传图片</Button>
            </Upload>
            <Button type="primary" onClick={hanldeCropAll}>
              一键剪裁
            </Button>
          </section>
          <Divider />
          <section>
            <div className="cutter-editor">
              <Checkbox
                className="cutter-editor-check"
                disabled={!normalImg}
                onChange={e => handleCheckChange(e.target.checked, 'normal')}
                checked={normalcheck}
              >
                配图
              </Checkbox>
              <ImageEditor label="配图" image={image} type="normal" width={300} height={150} confirmRef={normalRef} onUploadSuccess={setNormalImg} />
            </div>
            <div className="cutter-editor">
              <Checkbox
                className="cutter-editor-check"
                disabled={!xiaomiImg}
                onChange={e => handleCheckChange(e.target.checked, 'xiaomi')}
                checked={xiaomicheck}
              >
                小米配图
              </Checkbox>
              <ImageEditor
                label="小米配图"
                image={image}
                type="xiaomi"
                width={876}
                height={324}
                confirmRef={xiaomiRef}
                onUploadSuccess={setXiaomiImg}
              />
            </div>
            <div className="cutter-editor">
              <Checkbox
                className="cutter-editor-check"
                disabled={!oppoImg}
                onChange={e => handleCheckChange(e.target.checked, 'oppo')}
                checked={oppocheck}
              >
                oppo通知栏配图
              </Checkbox>
              <ImageEditor
                label="oppo通知栏配图"
                image={image}
                type="oppo"
                width={220}
                height={220}
                borderRadius={50}
                confirmRef={oppoRef}
                onUploadSuccess={setOppoImg}
              />
            </div>
          </section>
          <section className="cutter-bottom">
            <Button
              onClick={() => {
                setShowModal(false);
                setNormalcheck(false);
                setXiaomicheck(false);
                setOppocheck(false);
              }}
            >
              取消
            </Button>
            <Button type="primary" onClick={handleConfirmImage}>
              确认
            </Button>
          </section>
          <Divider />
          <div>
            <p>tip：</p>
            <p>1.一点默认配图为300 * 150</p>
            <p>1.小米默认配图为876 * 324</p>
            <p>2.oppo默认配图为288 * 288， 圆角30</p>
          </div>
        </div>
      </Modal>
    </>
  );
});