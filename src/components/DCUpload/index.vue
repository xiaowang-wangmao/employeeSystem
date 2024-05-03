<template>
  <a-button
    v-bind="$attrs"
    class="flex-items-center dc-upload"
    type="primary"
    :ghost="props.ghost"
    style="z-index: 10"
    @click="showModal"
  >
    <SvgRaw :name="props.icon" />
    {{ showButtonText }}
  </a-button>
  <a-modal
    v-model:visible="visible"
    :width="width"
    :title="title === DEFAULTS.TITLE ? '导入' : title"
    :ok-text="'确定'"
    :ok-button-props="{ disabled: fileList.length === 0 && !props.customTip }"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
  >
    <a-row>
      <a-alert
        v-if="errorMsg && !hiddenMsg"
        type="error"
        style="width: 100%; margin-bottom: 16px; padding: 10px 24px"
        class="error-alert"
      >
        <template #message>
          <a-row
            type="flex"
            justify="space-between"
            style="max-height: 88px; overflow-y: auto"
          >
            <template v-if="typeof errorMsg === 'object'">
              <a-col
                v-for="(item, index) in errorMsg"
                :key="index"
                class="flex-items-center"
                style="column-gap: 15px"
              >
                <SvgRaw name="icon_exclamation_mark" />
                <span style="width: 300px">{{ item.message }}</span>
              </a-col>
            </template>
            <template v-else>
              <a-col class="flex-items-center" style="column-gap: 15px">
                <SvgRaw name="icon_exclamation_mark" />
                <span style="width: 300px">{{ errorMsg }}</span>
              </a-col>
            </template>

            <a-col
              v-if="props.showRouteButton"
              class="flex-items-center dc-ux-pointer"
              style="
                column-gap: 4px;
                text-align: right;
                position: absolute;
                right: 15px;
              "
            >
              <SvgRaw name="icon_change_record" />
              <router-link
                :to="{ path: props.routeName }"
                style="color: #d20000"
              >
                1
              </router-link>
              <!-- 查看业务数据清单 -->
            </a-col>
          </a-row>
        </template>
      </a-alert>
      <p v-else>
        {{ tip }}
      </p>
    </a-row>
    <a-row>
      <slot name="templateDownload"></slot>
    </a-row>

    <div style="margin-top: 24px">
      <a-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
        :accept="accept"
        @change="handleChange"
        @remove="handleRemove"
      >
        <DCButton type="primary" icon="icon_upload">
          {{ '上传文件' }}
        </DCButton>
        <template #itemRender="{ file, actions: { remove } }">
          <a-row
            type="flex"
            justify="space-between"
            style="
              padding: 8px;
              background: #f3f7fd;
              border-radius: 2px;
              margin-top: 12px;
            "
          >
            <a-col class="flex-items-center">
              <SvgRaw name="icon_file" />
              <span style="color: #1c69d4">{{ file.name }}</span>
            </a-col>
            <a-col class="flex-items-center dc-ux-pointer" @click="remove" style="cursor: pointer;">
              <SvgRaw name="icon_delete" />
              删除
            </a-col>
          </a-row>
        </template>
      </a-upload>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { message, UploadProps } from 'ant-design-vue';
import { isEmpty, isFunction } from '@/utils/is/is';

const fileList = ref<any[]>([]);
const DEFAULTS = {
  BUTTON_TEXT: 'BUTTON_TEXT',
  TITLE: 'TITLE',
};
const props = withDefaults(
  defineProps<{
    buttonText: string;
    showButtonText: string;
    title: string;
    width: string;
    tip: string;
    uploadApi: Function;
    accept: string;
    params?: any;
    icon: string;
    ghost: boolean;
    hiddenMsg: boolean;
    routeName?: any;
    showRouteButton?: boolean;
    customTip?: string;
    limitSize?: number;
    showApiErrorMsg?: boolean; // 控制是否在弹窗内展示接口返回来错误提示
  }>(),
  {
    showButtonText:'选择文件',
    hiddenMsg: false,
    ghost: true,
    icon: 'icon_import',
    buttonText: 'BUTTON_TEXT',
    title: 'TITLE',
    width: '573px',
    accept: '.xlsx,.xls',
    routeName: '/data-assets/business-terminology/terminology-list',
    showRouteButton: true,
    limitSize: 100,
    showApiErrorMsg: false,
  }
);

const emit = defineEmits(['error', 'update']);
const visible = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  fileList.value = [file];
  return false;
};
const showModal = () => {
  visible.value = true;
};
const uploading = ref<boolean>(false);
const errorMsg = ref('' as any);
async function handleUpload() {
  if (isFunction(props.uploadApi)) {
    const params = {
      ...(props.params
        ? {
            data: props.params,
          }
        : {}),
      file: fileList.value[0]?.originFileObj,
    };
    uploading.value = true;
    try {
      confirmLoading.value = true;
      const res = await props.uploadApi(params).finally(() => {
        confirmLoading.value = false;
      });
      if (res) {
        fileList.value = [];
        uploading.value = false;
        visible.value = false;
        message.success('上传成功');
        errorMsg.value = '';
        emit('update', res.data);
      } else {
        uploading.value = false;
        if (props.showApiErrorMsg) {
          errorMsg.value = res.message;
        }
        emit('error', '导入失败');
      }
    } catch (error: any) {
      uploading.value = false;
      if (props.showApiErrorMsg) {
        errorMsg.value = error.message;
      }
      emit('error', error);
    }
  }
}
const handleOk = () => {
  if (isEmpty(fileList.value)) {
    message.error(props.customTip);
  } else {
    handleUpload();
  }
};

const handleChange = (info) => {
  let resFileList = [...info.fileList];

  // 文件格式的限制，只保留符合accept配置的文件
  let suffixValidate = true;
  let sizeValidate = true;
  errorMsg.value = '';
  resFileList = resFileList.filter((file) => {
    const suffix = `.${file.name.substring(file.name.lastIndexOf('.') + 1)}`;
    const result = props.accept.indexOf(suffix) > -1;
    const sizeResult =
      props.limitSize && file.size / 1024 / 1024 > props.limitSize;
    if (!result) {
      suffixValidate = false;
    }
    if (sizeResult) {
      sizeValidate = false;
    }
    return result && !sizeResult;
  });
  if (!suffixValidate) {
    errorMsg.value = `文件上传失败，请上传${props.accept.replace(
      /\./g,
      ''
    )}格式的文件`;
  } else if (!sizeValidate) {
    errorMsg.value = `文件上传失败，该文件已超出${props.limitSize}M，请重新选择文件`;
  }

  // 上传列表数量的限制，只保留最新上传的文件
  resFileList = resFileList.slice(-1);

  fileList.value = resFileList;
};

function handleRemove() {
  errorMsg.value = '';
}
</script>

<style lang="less" scoped>
@error-color: #d20000;

.error-alert {
  div {
    color: @error-color;
  }

  svg {
    fill: @error-color;
  }
}
</style>
