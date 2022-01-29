// 入参 fmt-格式 date-日期
Date.prototype.format = function (fmt) {
    const o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
    }
    if ((/(y+)/).test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return fmt
}

String.prototype.caption = function () {
    return this.replace(/^\w/, w => w.toUpperCase())
}

String.prototype.urlLastPath = function () {
    return this.split("/").filter(s => s).pop().replace(/-(\w)/g, (w, $1) => $1.toUpperCase())
}

const lineEnd = "\n"

/**
 * @param { YApiScheme } scheme
 * @param {string} name
 */
function parseQueryParam(scheme, name) {
    /**
     * @type {YApiQueryParam[]}
     */
    const queries = scheme.req_query || []
    if (queries.length > 0) {
        let queryParam = [];
        queryParam.push("/**")
        queryParam.push(` * @typedef ${name}Query`)
        queries.forEach(query => {
            const example = query.example ? ` example: ${query.example}` : ""
            queryParam.push(` * @property {string${query.required === "1" ? "" : "="}} ${query.name} - ${query.desc} ${example}`)
        })
        queryParam.push(" */")
        return queryParam.join(lineEnd)
    }
    return null
}

/**
 * @param { YApiScheme } scheme
 * @param {string} name
 */
function parsePathParam(scheme, name) {
    /**
     * @type {YApiPathParam[]}
     */
    const params = scheme.req_params || []
    if (params.length > 0) {
        let queryParam = [];
        queryParam.push("/**")
        queryParam.push(` * @typedef ${name}PathParam`)
        params.forEach(param => {
            const example = param.example ? ` example: ${param.example}` : ""
            queryParam.push(` * @property {string} ${param.name} - ${param.desc} ${example}`)
        })
        queryParam.push(" */")
        return queryParam.join(lineEnd)
    }
    return null
}


/**
 *
 * @param {ResponseItem} responseBody
 * @param {string[]} defs
 * @param {string} nameSpace
 */
function parseSchemeItem(responseBody, defs, nameSpace) {
    if(!responseBody.type){
        if(responseBody.properties){
            responseBody.type = "object"
        }else if (responseBody.items){
            responseBody.type = "array"
        }else{
            responseBody.type = "string"
        }
    }
    if (responseBody.type === "object") {
        /** @type {ObjectItem}*/
        let res = responseBody
        if (Object.keys(res.properties || {}).length === 0) {
            return null
        }
        /** @type {string[]} */
        let required = res.required || []
        /**  @type {string[]} */
        let def = []
        def.push("/**")
        def.push(` * @typedef ${nameSpace}`)
        for (let key in res.properties) {
            let scheme = res.properties[key]
            let isRequired = required.indexOf(key) > -1
            let result = parseSchemeItem(scheme, defs, `${nameSpace}${key.caption()}`)
            console.info(` * @property {${result || 'any'}${isRequired ? "" : "="}} ${key} ${scheme.description || ""}`)
            def.push(` * @property {${result || 'any'}${isRequired ? "" : "="}} ${key} ${scheme.description || ""}`)
        }
        def.push(" */")
        defs.push(def.join(lineEnd))
        defs.push(lineEnd)
        return nameSpace
    } else if (responseBody.type === "array") {
        let result1 = parseSchemeItem(responseBody.items, defs, nameSpace)
        return `${result1 || 'any'}[]`
    } else {
        return typeMapping[responseBody.type.toLowerCase()] || "any"
    }
}

const typeMapping = {
    string: 'string',
    integer: 'number',
    number: 'number',
    date: 'string'
}

/**
 * @param {string[]} paramInfo
 * @param {string[]} paramDefines
 * @param { YApiScheme } scheme
 * @param {string} name
 * @param {string} customResponse
 */
function parseResponseBody(paramInfo, paramDefines, scheme, name,customResponse) {
    let responseBody = scheme.res_body
    if (customResponse) {
        console.info(JSON.parse(JSON.stringify(responseBody)))
        console.info(`customResponse ${customResponse}`)
        try {
            let array = customResponse.split(".").filter(s => s)
            console.info(array)
            for (let key of array) {
                if (responseBody.properties[key]) {
                    responseBody = responseBody.properties[key]
                }
            }
        } catch (e) {
            console.info(e)
        }
    }
    if (responseBody == null) {
        return
    }
    let result = parseSchemeItem(responseBody, paramDefines, `${name}Response`)
    if (result != null) {
        paramInfo.push(` * @return {Promise<${result}>} `)
    } else {
        paramInfo.push(` * @return {Promise<any>} `)
    }
}

/**
 * @param {string[]} paramInfo
 * @param {string[]} paramDefines
 * @param { YApiScheme } scheme
 * @param {string} name
 */
function parseRequestBody(paramDefines, scheme, name) {

    let requestBody = scheme.req_body_other
    if (!requestBody || Object.keys(requestBody).length == 0) {
        return null
    }
    return parseSchemeItem(requestBody, paramDefines, `${name}Body`);
}

// /**
//  * @param { YApiScheme } scheme
//  * @param {string} name
//  */
// function parseRequestBody(scheme, name) {
//     const requestBody = scheme.res_body
//     if(requestBody == null) return
//
// }

/**
 * @param { YApiScheme } scheme
 * @param {string} document
 * @param {string=} name
 * @param {string=} template
 */
export function parseScheme2Template(
    _scheme,
    document,
    name,
    customResponse,
    template
) {
    /** @type {YApiScheme} */
    const scheme = JSON.parse(JSON.stringify(_scheme))
    const namespace = name ? name : scheme.query_path.path.urlLastPath();
    const Namespace = namespace.caption()

    let paramNames = {}
    paramNames.Method = scheme.method
    paramNames.Path = scheme.query_path.path
    let paramDefines = [];
    let paramInfo = []
    let params = []
    let pathParams = parsePathParam(scheme, Namespace)
    if (pathParams != null) {
        paramNames.PathParam = "pathParam"
        paramDefines.push(pathParams)
        paramDefines.push(lineEnd)
        params.push(`pathParam`)
        paramInfo.push(` * @param {${Namespace}PathParam} pathParam`)
    }

    let queryParams = parseQueryParam(scheme, Namespace)
    if (queryParams != null) {
        paramNames.Query = "query"
        paramDefines.push(queryParams)
        paramDefines.push(lineEnd)
        params.push(`query`)
        paramInfo.push(` * @param {${Namespace}Query} query`)
    }

    let bodyParams = parseRequestBody(paramDefines, scheme, Namespace)
    if (bodyParams != null) {
        paramNames.Body = "body"
        params.push(`body`)
        paramInfo.push(` * @param {${bodyParams}} body`)
    }

    parseResponseBody(paramInfo, paramDefines, scheme, Namespace, customResponse)


    return `
// #region ${scheme.title}    
${paramDefines.join(lineEnd)}

/**
 * ${scheme.title}
 * @date ${new Date().format("yyyy-MM-dd hh:mm:ss")}
 * @link ${document}
 * @backend ${scheme.username}
 * @path ${scheme.query_path.path}
 * @method ${scheme.method}
${paramInfo.join(lineEnd)} 
 */
export function ${namespace}(${params.join(", ")}){
${fakeESTemplate(template, paramNames)}  
}
//#endregion
`;
}

export const templateRegexp = /\${([^${}]+)}/g

/**
 *
 * @param template
 * @param params
 */
function fakeESTemplate(template, params) {
    if (!template) return ""
    return template.replace(templateRegexp, (whole, name) => {
        return params[name] || ""
    })
    // let {PathParam, Query, Body, Path} = params
    // let tpl =  template.replace(templateRegexp, (whole, name) => {
    //     return `" + ${params[name] || ""} + "`
    // })
    // return new Function("PathParam", "Query", "Body", "Path", "\"" + tpl + "\"")(PathParam, Query, Body, Path)
}



