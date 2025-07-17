import {httpRequest} from "@/utils/http";

export function findAll(){
    return httpRequest({
        method:"get",
        url:"/knowledge/findAll",
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}


export function selectKnowledgeById(id) {
    return httpRequest({
        method: "get",
        url: `/knowledge/selectById/${id}`,
        headers: {
            'token': window.localStorage.getItem("token")
        },
    })
}
export function selectComment(id) {
    return httpRequest({
        method: 'get',
        url: `/knowledge/selectByKnowledge/${id}`,
        headers: {
            'token': window.localStorage.getItem("token")
        },
    })
}
export function addComment(comment) {
    return httpRequest({
        method: 'post',
        url: `/knowledge/addByKnowledge`,
        data: comment,
        headers: {
            'token': window.localStorage.getItem("token")
        },
    })
}


