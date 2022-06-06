USE genesys;

DROP VIEW IF EXISTS conversation_metric_sum;

CREATE VIEW conversation_metric_sum
AS

	SELECT conversationId, 
	GROUP_CONCAT( if(name='nConnected',value,NULL) ) AS 'nConnected',
	GROUP_CONCAT( if(name='nError',value,NULL) ) AS 'nError',
	GROUP_CONCAT( if(name='nFlow',value,NULL) ) AS 'nFlow',
	GROUP_CONCAT( if(name='nFlowMilestone',value,NULL) ) AS 'nFlowMilestone',
	GROUP_CONCAT( if(name='nFlowOutcome',value,NULL) ) AS 'nFlowOutcome',
	GROUP_CONCAT( if(name='nFlowOutcomeFailed',value,NULL) ) AS 'nFlowOutcomeFailed',
	GROUP_CONCAT( if(name='nOffered',value,NULL) ) AS 'nOffered',
	GROUP_CONCAT( if(name='nOutbound',value,NULL) ) AS 'nOutbound',
	GROUP_CONCAT( if(name='nOutboundAttempted',value,NULL) ) AS 'nOutboundAttempted',
	GROUP_CONCAT( if(name='tAbandon',value,NULL) ) AS 'tAbandon',
	GROUP_CONCAT( if(name='tAcd',value,NULL) ) AS 'tAcd',
	GROUP_CONCAT( if(name='tAcw',value,NULL) ) AS 'tAcw',
	GROUP_CONCAT( if(name='tAlert',value,NULL) ) AS 'tAlert',
	GROUP_CONCAT( if(name='tAnswered',value,NULL) ) AS 'tAnswered',
	GROUP_CONCAT( if(name='tContacting',value,NULL) ) AS 'tContacting',
	GROUP_CONCAT( if(name='tDialing',value,NULL) ) AS 'tDialing',
	GROUP_CONCAT( if(name='tFlow',value,NULL) ) AS 'tFlow',
	GROUP_CONCAT( if(name='tFlowDisconnect',value,NULL) ) AS 'tFlowDisconnect',
	GROUP_CONCAT( if(name='tFlowExit',value,NULL) ) AS 'tFlowExit',
	GROUP_CONCAT( if(name='tFlowOut',value,NULL) ) AS 'tFlowOut',
	GROUP_CONCAT( if(name='tFlowOutcome',value,NULL) ) AS 'tFlowOutcome',
	GROUP_CONCAT( if(name='tHandle',value,NULL) ) AS 'tHandle',
	GROUP_CONCAT( if(name='tHeld',value,NULL) ) AS 'tHeld',
	GROUP_CONCAT( if(name='tHeldComplete',value,NULL) ) AS 'tHeldComplete',
	GROUP_CONCAT( if(name='tIvr',value,NULL) ) AS 'tIvr',
	GROUP_CONCAT( if(name='tNotResponding',value,NULL) ) AS 'tNotResponding',
	GROUP_CONCAT( if(name='tShortAbandon',value,NULL) ) AS 'tShortAbandon',
	GROUP_CONCAT( if(name='tTalk',value,NULL) ) AS 'tTalk',
	GROUP_CONCAT( if(name='tTalkComplete',value,NULL) ) AS 'tTalkComplete',
	GROUP_CONCAT( if(name='tVoicemail',value,NULL) ) AS 'tVoicemail'
	FROM
	(
		SELECT 
		conversation.conversationId as conversationId,
		name,
		SUM(value) as value
			FROM conversation
			INNER JOIN participant on (participant.conversationId = conversation.conversationId)
			INNER JOIN session on (session.participantId = participant.participantId)
			INNER JOIN conversation_metric ON (conversation_metric.sessionId = session.sessionId)        
			GROUP BY conversation.conversationId, name
	) sum_metric
	GROUP BY conversationId;
