USE genesys;

DROP VIEW IF EXISTS conversation_detail;

CREATE VIEW conversation_detail
AS
	SELECT
	conversation.conversationId,
    conversation.conversationStart,
	conversation.conversationEnd,
	conversation.originatingDirection initialDirection,
	GROUP_CONCAT(DISTINCT cat_user.name) AS users,
	GROUP_CONCAT(DISTINCT session.ani) AS ani,
	GROUP_CONCAT(DISTINCT session.dnis) AS dnis,
	( CASE WHEN participant.purpose IN ('customer', 'external', 'user') THEN participant.participantName ELSE NULL END) AS remote,
	GROUP_CONCAT(DISTINCT session.direction) AS direction,
	GROUP_CONCAT(DISTINCT session.mediaType) AS mediaType,
	GROUP_CONCAT(DISTINCT cat_queue.name) AS queue,
	GROUP_CONCAT(DISTINCT cat_wrapupcode.name) AS wrapupcode,
	GROUP_CONCAT(DISTINCT segment.wrapUpNote) AS wrapUpNote,
	GROUP_CONCAT(DISTINCT cat_campaign.name) AS campaign,
	GROUP_CONCAT(DISTINCT cat_contactlist.name) AS contactlist,
	GROUP_CONCAT(DISTINCT session.outboundContactId) AS outboundContactId,
	GROUP_CONCAT(DISTINCT session.activeSkillIds) AS activeSkillIds,
	GROUP_CONCAT(DISTINCT CASE WHEN session.recording = 1 THEN session.recording ELSE NULL END) AS recording,
	GROUP_CONCAT(DISTINCT session.flowName) AS flowName,
	GROUP_CONCAT(DISTINCT session.flowType) AS flowType,
	GROUP_CONCAT(DISTINCT segment.errorCode) AS errorCode,
	GROUP_CONCAT(DISTINCT session.dispositionAnalyzer) AS dispositionAnalyzer,
	GROUP_CONCAT(DISTINCT session.dispositionName) AS dispositionName,    
	GROUP_CONCAT(DISTINCT CONCAT (cat_outcome.name, '=', flow_outcome.flowOutcomeValue) ORDER BY cat_outcome.name ASC SEPARATOR '|') AS outcomes,
	GROUP_CONCAT(DISTINCT CONCAT (conversation_custom_attribute.name, '=', conversation_custom_attribute.value) ORDER BY conversation_custom_attribute.name ASC SEPARATOR '|') AS attributes,
    GROUP_CONCAT(DISTINCT CONCAT (conversation_metric.name, '=', conversation_metric.value) ORDER BY conversation_metric.name ASC SEPARATOR '|') AS metrics,
    conversation_metric_sum.*,
    conversation_flow_outcome_sum.*
    FROM conversation
	INNER JOIN participant on (participant.conversationId = conversation.conversationId)
	INNER JOIN session on (session.participantId = participant.participantId)
	INNER JOIN segment on (segment.sessionId = session.sessionId)
    LEFT JOIN conversation_custom_attribute on (conversation_custom_attribute.conversationId = conversation.conversationId)
    LEFT JOIN conversation_metric on (conversation_metric.sessionId = session.sessionId)
    LEFT JOIN conversation_metric_sum on (conversation_metric_sum.conversationId = conversation.conversationId)
    LEFT JOIN conversation_flow_outcome_sum on (conversation_flow_outcome_sum.conversationId = conversation.conversationId)    
	LEFT JOIN flow_outcome on (flow_outcome.sessionId = session.sessionId)
    LEFT JOIN cat_outcome on (cat_outcome.id = flow_outcome.flowOutcomeId)
    LEFT JOIN cat_queue on (cat_queue.id = segment.queueId)
	LEFT JOIN cat_user on (cat_user.id = participant.userId)
	LEFT JOIN cat_wrapupcode on (cat_wrapupcode.id = segment.wrapUpCode)
	LEFT JOIN cat_campaign on (cat_campaign.id = session.outboundCampaignId)  
	LEFT JOIN cat_contactlist on (cat_contactlist.id = session.outboundContactListId)
	WHERE conversation.conversationId = participant.conversationId
	AND participant.participantId = session.participantId
	AND session.sessionId = segment.sessionId
	GROUP BY conversation.conversationId, conversation.conversationStart, conversation.conversationEnd, conversation.originatingDirection;
