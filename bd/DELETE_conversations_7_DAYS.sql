DELETE conversation, participant, session, segment, conversation_custom_attribute, conversation_metric, flow_outcome
FROM conversation
INNER JOIN participant on (participant.conversationId = conversation.conversationId)
INNER JOIN session on (session.participantId = participant.participantId)
INNER JOIN segment on (segment.sessionId = session.sessionId)
LEFT JOIN conversation_custom_attribute on (conversation_custom_attribute.conversationId = conversation.conversationId)
LEFT JOIN conversation_metric on (conversation_metric.sessionId = session.sessionId)
LEFT JOIN flow_outcome on (flow_outcome.sessionId = session.sessionId)
WHERE conversationEnd < NOW()- INTERVAL 7 DAY;