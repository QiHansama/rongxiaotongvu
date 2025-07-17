
/*import { httpRequest } from "@/util/http.js";*/

import {httpRequest} from "@/utils/http";

export const getQuestionList = (params) => {
    // 调用后端接口，假设后端接口地址为 /api/questions
    return httpRequest({
        url: '/question', // 后端查询问答列表的接口地址
        method: 'get', // 请求方式为 GET
        params:params, // 传递查询参数（包含关键词）
        headers:{
            "token":window.localStorage.getItem("token")
        }
    });
};


export const submitQuestion = (data) => {
    return httpRequest({
        url: '/question/submit', // 对应后端@PostMapping("/submit")
        method: 'post',
        data,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    });
};