/**CONVERSATIONS**/

USE genesys;

DROP TABLE IF EXISTS conversation;
DROP TABLE IF EXISTS participant;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS segment;
DROP TABLE IF EXISTS flow_outcome;
DROP TABLE IF EXISTS conversation_metric;

/*conversation*/
CREATE TABLE conversation(conversationId VARCHAR(50) PRIMARY KEY, conversationStart timestamp, conversationEnd timestamp, divisionIds VARCHAR(150), externalTag VARCHAR(50), originatingDirection VARCHAR(50) );

CREATE INDEX idx_conversation_start
ON conversation (conversationStart);

/*participant*/
CREATE TABLE participant(conversationId VARCHAR(50), participantId VARCHAR(50) PRIMARY KEY,  participantName VARCHAR(100), purpose VARCHAR(20), userId VARCHAR(50), externalContactId VARCHAR(50), externalOrganizationId VARCHAR(50) );

CREATE INDEX idx_participant_conversationId
ON participant (conversationId);

/*session*/
CREATE TABLE session(participantId VARCHAR(50),  sessionId VARCHAR(50) PRIMARY KEY, ani VARCHAR(100), dnis VARCHAR(100), direction VARCHAR(20), activeSkillIds VARCHAR(100), dispositionAnalyzer VARCHAR(100), dispositionName VARCHAR(100), edgeId VARCHAR(50), mediaType VARCHAR(20), messageType VARCHAR(20), outboundCampaignId VARCHAR(50), outboundContactId VARCHAR(50), outboundContactListId VARCHAR(50), recording TINYINT, remote VARCHAR(50), scriptId VARCHAR(50), sessionDnis VARCHAR(50), flowId VARCHAR(50), flowName VARCHAR(100), flowType VARCHAR(20), flowVersion VARCHAR(10));

CREATE INDEX idx_session_participantId
ON session (participantId);

/*segment*/
CREATE TABLE segment(sessionId VARCHAR(50),  segmentType VARCHAR(50), segmentStart TIMESTAMP, segmentEnd TIMESTAMP, disconnectType VARCHAR(50), errorCode VARCHAR(100), queueId VARCHAR(50), requestedRoutingSkillIds VARCHAR(100), sourceConversationId VARCHAR(50), wrapUpCode VARCHAR(50), wrapUpNote VARCHAR(100), wrapUpTags VARCHAR(100), PRIMARY KEY (sessionId, segmentType) );

CREATE INDEX idx_segment_sessionId
ON segment (sessionId);

/*flow_outcomes*/
CREATE TABLE flow_outcome(sessionId VARCHAR(50), flowOutcomeId VARCHAR(50), flowOutcomeStartTimestamp TIMESTAMP, flowOutcomeEndTimestamp TIMESTAMP, flowOutcomeValue VARCHAR(20), PRIMARY KEY (sessionId, flowOutcomeId));

CREATE INDEX idx_flowOutcome_sessionId
ON flow_outcome (sessionId);

/* conversation metric */
CREATE TABLE conversation_metric(sessionId VARCHAR(50),  emitDate TIMESTAMP, name VARCHAR(20), value VARCHAR(100), PRIMARY KEY (sessionId, name) );

CREATE INDEX idx_conversation_metric_sessionId
ON conversation_metric (sessionId);
