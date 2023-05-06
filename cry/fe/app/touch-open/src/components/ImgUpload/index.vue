<template>
  <div class="upload-wrapper clearfix">
    <a-upload v-model:file-list="fileList" list-type="picture-card" :custom-request="customUpload"
      :before-upload="beforeUpload" @remove="handleRemoveCallBack" @preview="handlePreviewCallBack"
      @change="handleChange" :isImageUrl="() => { return true }" :disabled="disabled">
      <div v-if="fileList.length < maxLength">
        <plus-outlined class="upload-icon" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img v-if="previewImage" alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
  <a-modal title="裁剪图片" :visible="showImgCropper" :width="800" @ok="handleCropImg" @cancel="handleCancleCut">
    <div style="width:100%;height:450px">
      <vue-cropper autoCrop :img="originImg" ref="cropper" centerBox fixed :canMove="false" :fixedNumber="[20, 13]" />
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import Compressor from 'compressorjs';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  ref,
  toRaw,
  watch,
  toRefs,
  createVNode,
} from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { UploadImage } from '@/utils/uploadFile';
import { cloneDeep } from 'lodash';
import { UploadFile, UploadChangeParam, FileType, UploadRequestOption } from './interface'
import { getBase64, genBase64ToFile } from '@/utils/utils';
import 'vue-cropper/dist/index.css';
import { VueCropper } from "vue-cropper";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  isAllowUpload: {
    type: Boolean,
    default: true,
  },
  maxLength: {
    type: Number,
    default: 100,
  },
  crop: {
    type: Boolean,
    default: false,
  },
  original: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue', 'onBeforeUpload', 'uploadSuccess']);

const { modelValue, crop, original } = toRefs(props);
const previewVisible = ref(false);
const previewImage = ref('');
const fileList = ref<any[]>([]);
const targetCropFile = ref({});
fileList.value = cloneDeep(modelValue.value);

// about crop image fields
const showImgCropper = ref(false);
const cropper = ref<InstanceType<typeof VueCropper>>(null);
const originImg = ref<string>('');
const currentFileName = ref<string>('');

// Actions
const handleCancel = () => {
  previewVisible.value = false;
  previewImage.value = '';
};


const handlePreviewCallBack = (file: UploadFile<any>) => {
  previewImage.value = file.thumbUrl as string;
  previewVisible.value = true;
};

const handleChange = ({ file }: UploadChangeParam<UploadFile<any>>) => {
  // tip: stateless or crop operations do not throw file value for now
  if (!file.status || crop.value) {
    if (crop.value) targetCropFile.value = file
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  }
  if (file.status === 'removed') {
    emit('update:modelValue', toRaw(fileList.value));
  }
};

// Custom Upload
const beforeUpload = (file: FileType) => {
  emit('onBeforeUpload');

  if (!props.isAllowUpload) return false;

  const type = file.type.split('/')[0];
  const subType = file.type.split('/')[1];
  const isImage = type === 'image';
  const imgTypeList = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

  const isLt8M = file.size / 1024 / 1024 < 8;

  if (isImage && !isLt8M) {
    message.error('图片必须小于8MB！');
    return false;
  }

  if (!isImage) {
    message.error('请上传图片类型的文件！');
    return false;
  }

  if (isImage && imgTypeList.indexOf(subType) === -1) {
    message.error('文件格式错误，支持文件格式为：jpg、jpeg、png、gif、bmp');
    return false;
  }

  return true;
};

const customUpload = async ({ onSuccess, onError, file }: UploadRequestOption<any>, resend: boolean) => {
  // Whether to enable the clipping function
  if (crop.value && !resend) {
    currentFileName.value = (file as File).name
    showImgCropper.value = true;
    const base64Str = await getBase64(file as File);
    originImg.value = base64Str as string
    return
  }
  const type = (file as Blob).type.split('/')[0];
  const isImage = type === 'image';
  const uploadImage = async (file: File) => {
    const res = await UploadImage(file, original.value);
    if (res['code' as keyof typeof res] === 0) {
      onSuccess && onSuccess(res.result);
      // Tip：The file value is thrown here following the change operation described above
      if (crop.value) fileList.value.push(targetCropFile.value)
      // Tip：Compatible with picture preview on Safari browser
      fileList.value[fileList.value.length - 1].thumbUrl = res.result.url;
      // manual trigger
      if (resend) {
        fileList.value[fileList.value.length - 1].status = 'success';
        fileList.value[fileList.value.length - 1]['response'] = res.result;
      }
      emit('update:modelValue', toRaw(fileList.value));
      emit('uploadSuccess', res.result);
    } else {
      onError && onError(res['reason' as keyof typeof res]);
      if (resend) fileList.value[fileList.value.length - 1].status = 'error';
    }
  };

  // Image Upload
  if (isImage) {
    try {
      // GIF pictures are not compressed to prevent changing the original file type
      if ((file as File).type.split('/')[1] === 'gif') {
        uploadImage(file as File);
        return;
      }
      new Compressor((file as Blob), {
        quality: 0.6,
        success: async (result) => {
          uploadImage(result as File);
        },
        error(err) {
          console.log(err.message);
        },
      });
    } catch (error: any) {
      console.log('Eroor: ', error);
      onError && onError(error);
    }
    return;
  }
};

// Remove Image/Video CallBack
const handleRemoveCallBack = (file: UploadFile<any>) => {
  if (file.status === 'error') return true;
  Modal.confirm({
    title: '确定删除这张图片吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: '',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const targetIndex = fileList.value.indexOf(file);
      fileList.value.splice(targetIndex, 1);
      emit('update:modelValue', toRaw(fileList.value));
    },
    onCancel() {
      console.log('Cancel');
    },
  });
  return false;
};

// crop image
const handleCropImg = () => {
  cropper.value.getCropData((data: string) => {
    const file = genBase64ToFile(data, currentFileName.value)
    // Manually trigger the request again
    emit('update:modelValue', toRaw(fileList.value));
    customUpload({ file, action: '', method: 'POST' }, true)
  });
  showImgCropper.value = false;
}

const handleCancleCut = () => {
  showImgCropper.value = false;
  const lastLength = fileList.value.length - 1;
  const newFileList = fileList.value.slice();
  newFileList.splice(lastLength, 1);
  fileList.value = newFileList;
  emit('update:modelValue', newFileList);
}

watch(modelValue, (item) => {
  if (!toRaw(item)?.length) {
    fileList.value = [];
  } else {
    fileList.value = cloneDeep(item);
  }
});

const hasPendingTask = () => {
  return fileList.value.some((item) => {
    return item.status === 'uploading';
  });
};

defineExpose({
  hasPendingTask,
});
</script>
<style lang="less">
.ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
