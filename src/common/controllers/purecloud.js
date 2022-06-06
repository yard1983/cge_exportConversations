
const requestPromise = require('request-promise')
const fetchWrapper = require('../utils/utils').fetchWrapper

const getToken = (env, id, secret) => {
    return requestPromise.post({
        url: `https://login.${env}/oauth/token`,
        form: { grant_type: 'client_credentials' },
        auth: {
            user: id,
            password: secret,
            sendImmediately: true
        }
    })
}

const getConversations = (env, token, interval, pageSize = 100, pageNumber = 1) => {
    return fetchWrapper(`https://api.${env}/api/v2/analytics/conversations/details/query`, {
        method: 'POST',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            interval: interval,
            segmentFilters: [
                {
                    type: "or",
                    predicates: [
                        {
                            type: 'dimension',
                            dimension: 'mediaType',
                            operator: 'matches',
                            value: 'voice'
                        }
                    ]
                }
            ],
            order: 'desc',
            orderBy: 'conversationEnd',
            paging: {
                pageSize: pageSize,
                pageNumber: pageNumber
            }
        })
    })
}

const getConversation = (env, token, id) => {
    return fetchWrapper(`https://api.${env}/api/v2/analytics/conversations/${id}`, {
        method: 'GET',
        headers: { "Authorization": `bearer ${token}` }
    })
}

const postConversationDetailsJobs = (env, token, interval) => {
    return fetchWrapper(`https://api.${env}/api/v2/analytics/conversations/details/jobs`, {
        method: 'POST',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            interval: interval,
            order: "desc",
            orderBy: "conversationEnd",
            conversationFilters: [
                {
                    type: 'and',
                    predicates: [
                        {
                            type: 'dimension',
                            dimension: 'conversationEnd',
                            operator: 'exists',
                            value: null
                        }
                    ]
                }
            ],
            segmentFilters: [
                {
                    type: "or",
                    predicates: [
                        {
                            type: 'dimension',
                            dimension: 'mediaType',
                            operator: 'matches',
                            value: 'voice'
                        }
                    ]
                }
            ]
        })
    })
}

const getConversationDetailsJobStatus = (env, token, jobId) => {
    return fetchWrapper(`https://api.${env}/api/v2/analytics/conversations/details/jobs/${jobId}`, {
        method: 'GET',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
    })
}

const getConversationDetailsJobResults = (env, token, jobId, cursor, pageSize) => {
    let url = `https://api.${env}/api/v2/analytics/conversations/details/jobs/${jobId}/results`

    let append = "?"

    // add optional parameters
    if (cursor !== undefined) {
        url = `${url}${append}cursor=${cursor}`
        append = "&"
    }

    if (pageSize !== undefined)
        url = `${url}${append}pageSize=${pageSize}`

    return fetchWrapper(url, {
        method: 'GET',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
    })
}

const getCall = (env, token, conversationId) => {
    let url = `https://api.${env}/api/v2/conversations/calls/${conversationId}`

    return fetchWrapper(url, {
        method: 'GET',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
    })
}

const getConversationsAggregates = (env, token, interval, pageSize = 100, pageNumber = 1) => {
    return fetchWrapper(`https://api.${env}/api/v2/analytics/conversations/aggregates/query`, {
        method: 'POST',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "interval": interval,
            "granularity": "PT30M",
            "groupBy": [
                "direction",
                "conversationId",
                "mediaType",
                "queueId",
                "requestedRoutingSkillId",
                "sessionId",
                "userId"
            ],
            "views": [],
            "metrics": [
                "nOffered",
                "tAbandon",
                "nTransferred",
                "tAcd",
                "tFlowOut",
                "tAnswered",
                "tHandle",
                "nConsult",
                "nOutbound",
                "nOverSla",
                "tAcw",
                "tAlert",
                "tHeld",
                "tShortAbandon",
                "tTalk",
                "nBlindTransferred",
                "nConsultTransferred"
            ],
            order: 'desc',
            orderBy: 'conversationEnd',
            paging: {
                pageSize: pageSize,
                pageNumber: pageNumber
            }
        })
    })
}

const getCampaign = (env, token, campaignId) => {
    return fetchWrapper(`https://api.${env}/api/v2/outbound/campaigns/${campaignId}`, {
        method: 'GET',
        headers: { "Authorization": `bearer ${token}` }
    })
}

const updateCampaign = (env, token, campaign) => {
    return fetchWrapper(`https://api.${env}/api/v2/outbound/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(campaign)
    })
}

const getContactList = (env, token, id) => {
    return fetchWrapper(`https://api.${env}/api/v2/outbound/contactlists/${id}`, {
        method: 'GET',
        headers: { "Authorization": `bearer ${token}` }
    })
}

const createContactList = (env, token, contactList) => {
    return fetchWrapper(`https://api.${env}/api/v2/outbound/contactlists`, {
        method: 'POST',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contactList)
    })
}


const addContactsToContactList = (env, token, contactListId, contacts) => {
    return fetchWrapper(`https://api.${env}/api/v2/outbound/contactlists/${contactListId}/contacts`, {
        method: 'POST',
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contacts)
    })
}

const getConversationsById = (env, token, ids) => {
    return fetchWrapper(`https://api.${env}/api/v2/analytics/conversations/details?id=${ids}`, {
        method: 'GET',
        headers: { "Authorization": `bearer ${token}` }
    })
}

const getCatalog = (env, token, path, pageNumber, pageSize = 500) => {
    return fetchWrapper(`https://api.${env}/api/v2/${path}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: { "Authorization": `bearer ${token}` }
    })
}



module.exports = {
    getToken,
    getConversations,
    getConversation,
    postConversationDetailsJobs,
    getConversationDetailsJobStatus,
    getConversationDetailsJobResults,
    getCall,
    getConversationsAggregates,
    getCampaign,
    updateCampaign,
    getContactList,
    createContactList,
    addContactsToContactList,
    getConversationsById,
    getCatalog


}