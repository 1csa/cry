import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { Modal, Button, Spin, Icon, Slider, message, Upload, Divider } from 'antd'
import AvatarEditor from 'react-avatar-editor'
import debounce from 'lodash/debounce'
import { RcFile } from 'antd/lib/upload'
import { AvatarEditorProps } from 'react-avatar-editor/index'
import * as PushService from '@/services/pushService'

interface IProps {
  name: string
  articleImages: string[]
  width: number
  height: number
  border?: number
  borderRadius?: number
  type?: string
  appid?: string
  modalWidth?: number
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
}

interface AvatarProps extends AvatarEditorProps {
  getImageScaledToCanvas(): HTMLCanvasElement
}

const marks = {
  0.1: 0.1,
  0.5: 0.5,
  1: 1,
  1.5: 1.5,
  2: 2,
  2.5: 2.5,
  3: 3
}

const PushImage: React.FC<IProps> = ({ name, articleImages, width, height, border = 30, borderRadius = 0, type='image/png', appid = '', modalWidth = 1000, setFieldValue }) => {
  // modal show
  const [visible, setVisible] = useState<boolean>(false)
  // article images list
  const [articleImagesList, setArticleImagesList] = useState<Array<string>>([])
  // cur edit image cur preview image
  const [image, setImage] = useState<string | RcFile>('')
  const [croppedImage, setcroppedImage] = useState<string>('')
  // upload loading 
  const [upLoading, setUpLoading] = useState<boolean>(false)
  // image scale
  const [scale, setScale] = useState<number>(1)
  // upload image url from yidian or xiaomi
  const [uploadImageUrl, setUploadImageUrl] = useState<string>('')
  // selected image
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('')

  const avatar = useRef<AvatarProps>({})

  useEffect(() => {
    let articleImagesList = articleImages.map((item: string) => {
      if (item.indexOf('https://') > -1 || item.indexOf('http://') > -1) {
        return item
      } else {
        return `http://i1.go2yd.com/image.php?url=${item}`
      }
    })
    setArticleImagesList(articleImagesList)
  }, [articleImages])

  useEffect(() => {
    setFieldValue(name, selectedImageUrl)
  }, [selectedImageUrl])

  // render article image and cropped image
  const renderArticleImage = (): ReactNode => {
    let temp: string[] = []
    switch (name) {
      case 'img':
        temp = uploadImageUrl ? [...articleImagesList, uploadImageUrl] : [...articleImagesList]
        break
      case 'xiaomi_img_url':
      case 'oppo_push_notification_img_url':
        temp = uploadImageUrl ? [uploadImageUrl] : []
        break
      default:
        break
    }
    return temp.map((item: string) => {
      const imgClass = item === selectedImageUrl ? 'active article-image-preview-item' : 'article-image-preview-item'
      return (
        <div className={ imgClass } key={ item } onClick={ () => setSelectedImageUrl(item) }>
          <img src={ item } />
        </div>
      )
    })
  }

  // render article image
  const renderImageList = (): ReactNode => {
    return articleImagesList.map((item: string) => {
      // console.log(item, image, item === image)
      const imgClass = item === image ? 'active avatar-article-image' : 'avatar-article-image'
      return (
        <div className={ imgClass } key={ item } onClick={ () => setImage(item) }>
          <img src={ item } />
        </div>
      )
    })
  }

  // before upload
  const handleBeforeUpload = (file: RcFile): boolean => {
    setImage(file)
    return false
  }

  // render cropped image
  const renderCroppedImage = (): ReactNode => {
    const style = borderRadius ? { borderRadius: '22px' } : { borderRadius: '0' }
    return croppedImage && <img src={ croppedImage } width={ width / 3 } style={ style } />
  }

  // preview
  const handlePreview = (): void => {
    const croppedImage = avatar.current!.getImageScaledToCanvas().toDataURL()
    setcroppedImage(croppedImage)
  }

  // crop image
  const handleCropImage = (): void => {
    const canvas = avatar.current!.getImageScaledToCanvas()
    canvas.toBlob((blob: Blob) => {
      uploadCroppedImageByBlob(blob)
    }, type)
  }

  // upload cropped image
  const uploadCroppedImageByBlob = async (blob: Blob) => {
    setUpLoading(true)
    let formData = new FormData()
    formData.append('file', blob)
    formData.append('is_global', 'false')
    formData.append('is_icon', 'false')
    
    const { status, url, reason } = await PushService.uploadPushImage(formData, appid)
    if (status === 'success') {
      message.success('图片裁剪成功!')

      // different name different upload image url
      switch (name) {
        case 'img':
          setUploadImageUrl(`https://i1.go2yd.com/image.php?url=${url}&type=thumbnail_200x100`)
          break
        case 'xiaomi_img_url':
          setUploadImageUrl(url)
          break
        case 'oppo_push_notification_img_url':
          setUploadImageUrl(`https://i1.go2yd.com/image.php?url=${url}&type=png_96x96&cornerradius=22`)
          break
        default:
          break
      }
      setUpLoading(false)
      setVisible(false)
    } else {
      message.error(`图片裁剪失败: ${reason}`)
    }
  }

  return (
    <>
      {/* 图片列表 todo */}
      <div className="article-image-preview">
        { renderArticleImage() }
      </div>
      <Button icon="scissor" onClick={ () => setVisible(true) }>裁剪图片</Button>
      <Modal
        width={ modalWidth }
        visible={ visible }
        onCancel={ () => setVisible(false) }
        footer={ null }
      >
        <div className="avatar-modal">
          <h3>文章原始图片</h3>
          <div className="avatar-article-image-list">
            { renderImageList() }
          </div>
          <Upload
            beforeUpload={ (file: RcFile) => handleBeforeUpload(file) }
          >
            <Button>
              <Icon type="upload" />点击上传图片
            </Button>
          </Upload>
          <Divider />
          <div className="avatar-panel">
            {/* 预览区 */}
            <div className="avatar-preview">
              <h3>预览区域</h3>
              { renderCroppedImage() }
            </div>
            <Divider type="vertical" style={{ height: 'inherit' }} />
            {/* 裁剪区 */}
            <div className="avatar-body">
              <h3>裁剪区域</h3>
              <AvatarEditor 
                ref={ avatar }
                image={ image }
                width={ width }
                height={ height }
                border={ border }
                borderRadius={ borderRadius }
                color={[216, 216, 216, .8]}
                scale={ scale }
                rotate={ 0 }
                crossOrigin="anonymous"
              />
              <Slider
                value={ scale }
                marks={ marks }
                step={ 0.1 }
                min={ 0.1 }
                max={ 3 }
                onChange={ debounce((val) => setScale(val), 100) }
              />
            </div>
          </div>
          <div className="avatar-operate">
            <Button icon="picture" onClick={ handlePreview }>预览</Button>
            <Button type="primary" icon="scissor" style={{ marginLeft: '20px' }} onClick={ handleCropImage }>裁剪</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PushImage