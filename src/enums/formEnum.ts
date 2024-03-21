
export enum ErrorMessageEnum {
  Required = '未通过必填检查，请输入配置信息！',
  Duplicated = '未通过重复性检查，请重新输入！',
  Format = '未通过格式检查，请重新输入！',
  FieldType = '未通过字段类型检查，请重新输入！',
}

// action btn enum
export type BtnInfoType =
  {
    operationType: string;// 按钮类型
    text?: string;// 按钮展示文字
    code?: string;// 适配国际化code
    // auth?: PermissionEnum;// 权限配置
    popconfirm?: boolean;// 是否需要确认框
    modalconfirm?: boolean;// 是否需要确认框弹窗
    confirmTitle?: string;// 弹窗标题
    confirmContent?: string;// 弹窗内容
    icon?: string;
    disabled?: (row: any) => boolean;// 当前按钮是否可点击
    visible?: (row: any) => boolean;// 当前按钮是否展示
    onClick: (row: any) => void;// 按钮点击函数
  };

// 日期格式
export enum DateTypeEnumForOSS {
  'yyyy/MM/dd' = 'yyyy/MM/dd',
  'yyyy-MM-dd' = 'yyyy-MM-dd',
  'yyyyMMdd' = 'yyyyMMdd',
  'yyyy/dd/MM' = 'yyyy/dd/MM',
  'yyyy-dd-MM' = 'yyyy-dd-MM',
  'yyyyddMM' = 'yyyyddMM',
  'yyyy-MM' = 'yyyy-MM',
  'yyyyMM' = 'yyyyMM',
  'yyyy/MM' = 'yyyy/MM',
  'yyyy' = 'yyyy',
  'MM' = 'MM',
  'dd' = 'dd',
}

// 模糊搜索下拉框列表对象
export type OptionsType = {
  value: string,
  label: string,
  tag: string,
}

