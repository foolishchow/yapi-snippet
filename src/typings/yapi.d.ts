/// <reference no-default-lib="true"/>

export interface YApiBaseParam {
    /**
     * 是否必填
     * - `0` 否
     * - `1` 是
     */
    required: "0" | "1";
    /** 名称 */
    name: string;
    /** 示例 */
    example?: string;
    /** 备注 */
    desc?: string;
}

export interface YApiHeadParam extends YApiBaseParam {
    /** 值 */
    value: string;
}

export interface YApiQueryParam extends YApiBaseParam {

}

export interface YApiBodyFormParam extends YApiBaseParam {
    /** 类型 */
    type: RequestFormItemType;
}

export interface YApiPathParam {
    /** 名称 */
    name: string;
    /** 备注 */
    desc: string;
    /** 示例 */
    example: string;
}

export interface YApiQueryPath {
    path: string;
    params: any[]
}

/** 请求方式 */
export type Method =
    'GET' |
    'POST' |
    'PUT' |
    'DELETE' |
    'HEAD' |
    'OPTIONS' |
    'PATCH'

/** 请求表单条目类型 */
export type RequestFormItemType =
/** 纯文本 */
    'text' |
    /** 文件 */
    'file';


/** 请求数据类型 */
export type RequestBodyType =
/** 查询字符串 */
    'query' |
    /** 表单 */
    'form' |
    /** JSON */
    'json' |
    /** 纯文本 */
    'text' |
    /** 文件 */
    'file' |
    /** 原始数据 */
    'raw' |
    /** 无请求数据 */
    'none';

/** 返回数据类型 */
export type ResponseBodyType =
    'json' |
    /** 纯文本 */
    'text' |
    /** XML */
    'xml' |
    /** 原始数据 */
    'raw';

// yapi 实际上返回的是 json，有另外的字段指示其是否是 json schema
/** JSON Schema */
    // jsonSchema = 'json-schema',

export interface YApiScheme {
    req_query?: YApiQueryParam[];

    query_path: YApiQueryPath;
    /** 接口 ID */
    _id: number;
    /** 接口名称 */
    title: string;
    /** 状态 */
    status: string;
    /** 接口备注 */
    markdown: string;
    /** 请求路径 */
    path: string;
    /** 请求方式，HEAD、OPTIONS 处理与 GET 相似，其余处理与 POST 相似 */
    method: Method;
    /** 所属项目 id */
    project_id: number;
    /** 所属分类 id */
    catid: number;
    /** 标签列表 */
    tag: string[];
    /** 请求头 */
    req_headers?: YApiHeadParam[];
    /** 路径参数 */
    req_params?: YApiPathParam[];

    /** 仅 POST：请求内容类型。为 text, file, raw 时不必特殊处理。 */
    req_body_type: RequestBodyType;
    /** `req_body_type = json` 时是否为 json schema */
    req_body_is_json_schema: boolean;
    /** `req_body_type = form` 时的请求内容 */
    req_body_form?: YApiBodyFormParam[];
    /** `req_body_type = json` 时的请求内容 */
    req_body_other?: ResponseItem;
    /** 返回数据类型 */
    res_body_type: ResponseBodyType;
    /** `res_body_type = json` 时是否为 json schema */
    res_body_is_json_schema: boolean;
    /** 返回数据 */
    res_body?: ResponseItem;
    /** 创建时间（unix时间戳） */
    add_time: number;
    /** 更新时间（unix时间戳） */
    up_time: number;
    /** 创建人 ID */
    uid: number;

    username: string
}

export interface BaseItem {
    type: string;
    description?: string
}

export interface CommonItem extends BaseItem {
    type: "string" | "number"
}

export interface ObjectItem extends BaseItem {
    type: 'object';
    properties?: { [key: string]: ResponseItem };
    required?: string[]
}

export interface ArrayItem extends BaseItem {
    type: "array";
    items: ResponseItem
}

export type ResponseItem = CommonItem | ObjectItem | ArrayItem


