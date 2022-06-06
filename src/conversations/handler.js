const sendResponse = require('../common/utils/utils').sendResponse
const status = require('../common/constants/statusCodes')
const purecloud = require('../common/controllers/purecloud')
const dbmysql = require('../common/controllers/dbmysql')
const moment = require('moment-timezone')
const queries = require('../common/auxiliars/queries')

let conversations_array = []

exports.index = async (event) => {
    let interval, intervalMinutes;
    const pageSize = 100;
    let incompleteInteractionProcess = false;

    if(event && event.notFinished){
        console.log("Incomplete Interactions Mode");
        incompleteInteractionProcess = true;        
    }
    /*
    const clientId = process.env.CLIENT_ID;
    const secret = process.env.CLIENT_SECRET;
    const environment = process.env.ENVIRONMENT;
    intervalMinutes = process.env.INTERVAL_MINUTES;  
   */

    const clientId = "1e14caef-0509-4b78-927f-adf213e128dc";
    const secret = "28P3t8zx1JVmzEFd7fpa6_U2S6S0NQVlRccd76Wd9rw";
    const environment = "mypurecloud.com";
    intervalMinutes = 43200;  

    try {
        const tokenResponse = await purecloud.getToken(environment, clientId, secret)
        if (!tokenResponse || !JSON.parse(tokenResponse).access_token)
            return sendResponse(status.InternalServerError, { message: "Unable to retrieve a token" })

        const token = JSON.parse(tokenResponse).access_token
        
        if (incompleteInteractionProcess) {
            console.log("Getting incomplete interactions");
            await updateIncompleteConversations(environment, token);
        }
        else {
            console.log('Building analytics query interval')
            if(!intervalMinutes)
                intervalMinutes = 1440; //one day

            let intervalStart = moment(moment().format()).subtract(intervalMinutes, 'minutes')
            let intervalEnd = moment(moment().format())

            if(event && event.start)
                intervalStart = moment(event.start)
            
            if(event && event.end)
                intervalEnd =  moment(event.end)

            interval = `${intervalStart.format()}/${intervalEnd.format()}`
            const intervalUTC = `${intervalStart.utc().format()}/${intervalEnd.utc().format()}`
            console.log(`interval (local): ${interval} - UTC: ${intervalUTC}`)
                        
            // Query conversations from analytics API
            console.log('Querying conversations details API') 
            await insertNewConversations(environment, token, intervalUTC, pageSize);
        }

    } catch (error) {
        if (error.message)
            error = error.message
        console.error(`#CriticalAlarm: ${error}`)
        dbmysql.closeConnection();
        return sendResponse(status.InternalServerError, { error })
    } finally {
        console.info("Process finished");
        dbmysql.closeConnection();
    }
}


async function insertNewConversations(environment, token, intervalUTC, pageSize) {
    let response = {}
    let pageNumber = 1
    do {
        response = await purecloud.getConversations(environment, token, intervalUTC, pageSize, pageNumber)        
        if (response && response.conversations !== undefined) {
            console.log(`Conversations to process: ${response.conversations.length}`)
            for (const conversation of response.conversations) {
                //console.log(conversation)
                await saveConversation(conversation)
            }
        }
        pageNumber++       
    } while (response.conversations !== undefined);
    return true;
}

async function updateIncompleteConversations(environment, token) {
    const sql = `SELECT conversationId FROM conversation where conversationEnd is null`;
    await dbmysql.executeQuery(sql, function () {}).then(async function (result) {
        let response = {}
        let conversationRequest = "";
        let count = 0;
        for (const conv of result) {
            conversationRequest = conversationRequest + conv.conversationId + ',';
            count += 1;
            if (count > 99) {
                response = await purecloud.getConversationsById(environment, token, conversationRequest);
                for (const conversation of response.conversations) {
                    console.log(conversation)
                    await saveConversation(conversation)
                }
                conversationRequest = "";
                count = 0;
            }
        }
    });
}


async function saveConversation(conversation) {
    //conversation table
    let query = "";
    if (conversation && conversation.conversationId) {
        //console.log(`CONVERSATION TABLE -> conversationId: ${conversation.conversationId}, conversationStart: ${conversation.conversationStart}, conversationEnd: ${conversation.conversationEnd}` );            
        query += queries.addConversation(conversation);
        //participants
        if (conversation.participants) {
            for (const participant of conversation.participants) {
                //console.log(`PARTICIPANT TABLE -> conversationId: ${conversation.conversationId}, participantId: ${participant.participantId}, participantName: ${participant.participantName}, purpose: ${participant.purpose}` );
                query += queries.addParticipant(conversation.conversationId, participant);
                //console.log(query);
                //Sessions
                if (participant.sessions) {
                    for (const session of participant.sessions) {
                        //console.log(`SESSION TABLE -> participantId: ${participant.participantId}, sessionId: ${session.sessionId}, ani: ${session.ani}, dnis: ${session.dnis}` );
                        query += queries.addSession(participant.participantId, session);
                        //Segments
                        if (session.segments) {
                            for (const segment of session.segments) {
                                //console.log(`SEGMENT TABLE -> sessionId: ${session.sessionId}, segmentType: ${segment.segmentType}, segmentStart: ${segment.segmentStart}, segmentEnd: ${segment.segmentEnd}` );        
                                query += queries.addSegment(session.sessionId, segment);
                            }
                        }
                        //Metrics
                        if (session.metrics) {
                            for (const metric of session.metrics) {
                                //console.log(`CONVERSATION_METRIC TABLE -> sessionId: ${session.sessionId}, emitDate: ${metric.emitDate}, name: ${metric.name}, value: ${metric.value}` );        
                                query += queries.addConversationMetric(session.sessionId, metric);
                            }
                        }
                        //Flow outcomes
                        if(session.flow && session.flow.outcomes){
                            for(const outcome of session.flow.outcomes) {                    
                                //console.log(`FLOW_OUTCOME TABLE -> sessionId: ${session.sessionId}, flowOutcomeId: ${outcome.flowOutcomeId}, flowOutcomeStartTimestamp: ${outcome.flowOutcomeStartTimestamp}, flowOutcomeEndTimestamp: ${outcome.flowOutcomeEndTimestamp}, flowOutcomeValue: ${outcome.flowOutcomeValue}` );        
                                query += queries.addFlowOutcomes(session.sessionId, outcome);
                            } 
                        }
                    }
                }

            }
        }
    }
    await dbmysql.executeQuery(query);

}
(async () => { await exports.index() })()