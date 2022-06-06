const addConversation = (conversation) => {
	if (conversation.divisionIds)
	  conversation.divisionIds = conversation.divisionIds.join();
	
	 let query =
	   `INSERT INTO conversation(conversationId, conversationStart, conversationEnd, divisionIds, externalTag, originatingDirection) 
				  VALUES('${conversation.conversationId}', '${
	  conversation.conversationStart ?? null
	}', '${conversation.conversationEnd ?? null}', 
				  '${conversation.divisionIds ?? null}', '${
	  conversation.externalTag ?? null
	}', '${conversation.originatingDirection ?? null}') 
				  ON DUPLICATE KEY UPDATE
				  conversationStart= '${conversation.conversationStart ?? null}'
				  ,conversationEnd= '${conversation.conversationEnd ?? null}'
				  ,divisionIds='${conversation.divisionIds ?? null}'
				  ,externalTag='${conversation.externalTag ?? null}'
				  ,originatingDirection= '${conversation.originatingDirection ?? null}'
				  ;`;
	
	return query.replace(/'null'/g, "null");	
  };


  const addParticipant = (conversationId, participant) => {
	let query = 
	`INSERT INTO participant(conversationId, participantId,  participantName, purpose, userId, externalContactId, externalOrganizationId)
				VALUES('${conversationId}', '${participant.participantId}',  '${
	  participant.participantName ?? null
	}', '${participant.purpose ?? null}', '${participant.userId ?? null}', '${
	  participant.externalContactId ?? null
	}', '${participant.externalOrganizationId ?? null}')
	ON DUPLICATE KEY UPDATE
	participantName='${participant.participantName ?? null}'
	,purpose='${participant.purpose ?? null}'
	,userId='${participant.userId ?? null}'
	,externalContactId='${participant.externalContactId ?? null}'
	,externalOrganizationId='${participant.externalOrganizationId ?? null}'
	;`;

	return query.replace(/'null'/g, "null");	
  };

  const addSession = (participantId, session) => {
	if (session.activeSkillIds)
	  session.activeSkillIds = session.activeSkillIds.join();
	if(!session.flow)
	  session.flow = {};

	if(session.recording)
		session.recording = 1;
	else
		session.recording = 0

	let query = `INSERT INTO session (participantId,  sessionId, ani, dnis, direction, activeSkillIds, dispositionAnalyzer, dispositionName, edgeId, 
	  mediaType, messageType, outboundCampaignId, outboundContactId, outboundContactListId, recording, remote, scriptId, sessionDnis, flowId, flowName, flowType, flowVersion)
				VALUES('${participantId}',  '${session.sessionId}', '${
	  session.ani ?? null
	}', '${session.dnis ?? null}', '${session.direction ?? null}', '${
	  session.activeSkillIds ?? null
	}', '${session.dispositionAnalyzer ?? null}', '${
	  session.dispositionName ?? null
	}', '${session.edgeId ?? null}', '${session.mediaType ?? null}', '${
	  session.messageType ?? null
	}', '${session.outboundCampaignId ?? null}', '${
	  session.outboundContactId ?? null
	}', '${session.outboundContactListId ?? null}', ${session.recording}, '${session.remote ?? null}', '${session.scriptId ?? null}', '${session.sessionDnis ?? null}', '${session.flow.flowId ?? null}', '${session.flow.flowName ?? null}', '${session.flow.flowType ?? null}', '${session.flow.flowVersion ?? null}')
	ON DUPLICATE KEY UPDATE
	sessionId='${session.sessionId}'
	,ani='${session.ani ?? null}'
	,dnis='${session.dnis ?? null}'
	,direction='${session.direction ?? null}'
	,activeSkillIds='${session.activeSkillIds ?? null}'
	,dispositionAnalyzer='${session.dispositionAnalyzer ?? null}'
	,dispositionName='${session.dispositionName ?? null}'
	,edgeId='${session.edgeId ?? null}'
	,mediaType= '${session.mediaType ?? null}'
	,messageType='${session.messageType ?? null}'
	,outboundCampaignId='${session.outboundCampaignId ?? null}'
	,outboundContactId='${session.outboundContactId ?? null}'
	,outboundContactListId='${session.outboundContactListId ?? null}'
	,recording=${session.recording}
	,remote='${session.remote ?? null}'
	,scriptId='${session.scriptId ?? null}'
	,sessionDnis='${session.sessionDnis ?? null}'
	,flowId='${session.flow.flowId ?? null}'
	,flowName='${session.flow.flowName ?? null}'
	,flowType='${session.flow.flowType ?? null}'
	,flowVersion='${session.flow.flowVersion ?? null}'
	;`;

	return query.replace(/'null'/g, "null");	
  };

  const addSegment = (sessionId, segment) => {	  
	if (segment.wrapUpTags) 
		segment.wrapUpTags = session.wrapUpTags.join();
  
	let query = 
	`INSERT INTO segment(sessionId, segmentType, segmentStart, segmentEnd, disconnectType, errorCode, queueId, requestedRoutingSkillIds, sourceConversationId, wrapUpCode, wrapUpNote, wrapUpTags)
				VALUES('${sessionId}', '${segment.segmentType ?? null}', '${
	  segment.segmentStart ?? null
	}', '${segment.segmentEnd ?? null}', '${segment.disconnectType ?? null}', '${
	  segment.errorCode ?? null
	}', '${segment.queueId ?? null}', '${
	  segment.requestedRoutingSkillIds ?? null
	}', '${segment.sourceConversationId ?? null}', '${
	  segment.wrapUpCode ?? null
	}', '${segment.wrapUpNote ?? null}', '${segment.wrapUpTags ?? null}')
	ON DUPLICATE KEY UPDATE
	segmentStart='${segment.segmentStart ?? null}'
	,segmentEnd='${segment.segmentEnd ?? null}'
	,disconnectType='${segment.disconnectType ?? null}'
	,errorCode='${segment.errorCode ?? null}'
	,queueId='${segment.queueId ?? null}'
	,requestedRoutingSkillIds='${segment.requestedRoutingSkillIds ?? null}'
	,sourceConversationId='${segment.sourceConversationId ?? null}'
	,wrapUpCode='${segment.wrapUpCode ?? null}'
	,wrapUpNote='${segment.wrapUpNote ?? null}'
	,wrapUpTags='${segment.wrapUpTags ?? null}'
	;`;
	return query.replace(/'null'/g, "null");	
  };

  const addConversationMetric = (sessionId, metric) => {
	let query = 
	`INSERT INTO conversation_metric(sessionId, emitDate, name, value)
				VALUES('${sessionId}', '${metric.emitDate ?? null}',
				'${metric.name ?? null}', '${metric.value ?? null}')
	ON DUPLICATE KEY UPDATE
	emitDate='${metric.emitDate ?? null}'
	,value='${metric.value ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };


  const addFlowOutcomes = (sessionId, flowOutcome) => {	 
	let query =
	 `INSERT INTO flow_outcome(sessionId, flowOutcomeId, flowOutcomeStartTimestamp, flowOutcomeEndTimestamp, flowOutcomeValue)
			VALUES('${sessionId}', '${flowOutcome.flowOutcomeId??null}', '${flowOutcome.flowOutcomeStartTimestamp??null}', '${flowOutcome.flowOutcomeEndTimestamp??null}', '${flowOutcome.flowOutcomeValue??null}')
	ON DUPLICATE KEY UPDATE
	flowOutcomeStartTimestamp='${flowOutcome.flowOutcomeStartTimestamp ?? null}'
	,flowOutcomeEndTimestamp='${flowOutcome.flowOutcomeEndTimestamp ?? null}'
	,flowOutcomeValue='${flowOutcome.flowOutcomeValue ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  const addUser = (entity) => {	 
	if(entity.name)
		entity.name	= entity.name.replace("'", "''"); 
	if(entity.username)
		entity.username	= entity.username.replace("'", "''"); 
	let query =
	 `INSERT INTO cat_user(id, name, email, username)
			VALUES('${entity.id}', '${entity.name??null}', '${entity.email??null}', '${entity.username??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}'
	,email='${entity.email ?? null}'
	,username='${entity.username ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  const addWrapupcode = (entity) => {	
	if(entity.name)
	entity.name	= entity.name.replace("'", "''"); 

	let query =
	 `INSERT INTO cat_wrapupcode(id, name)
			VALUES('${entity.id}', '${entity.name??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  const addQueue = (entity) => {
	if(entity.name)
		entity.name	= entity.name.replace("'", "''"); 

	let query =
	 `INSERT INTO cat_queue(id, name)
			VALUES('${entity.id}', '${entity.name??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  const addCampaing = (entity) => {	 
	if(entity.name)
		entity.name	= entity.name.replace("'", "''"); 

	let query =
	 `INSERT INTO cat_campaign(id, name)
			VALUES('${entity.id}', '${entity.name??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };
  
  const addSkill = (entity) => {
	if(entity.name)
		entity.name	= entity.name.replace("'", "''"); 

	let query =
	 `INSERT INTO cat_skill(id, name)
			VALUES('${entity.id}', '${entity.name??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  const addContactlist = (entity) => {	
	if(entity.name)
		entity.name	= entity.name.replace("'", "''");  
	let query =
	 `INSERT INTO cat_contactlist(id, name)
			VALUES('${entity.id}', '${entity.name??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  const addOutcome = (entity) => {
	if(entity.name)
		entity.name	= entity.name.replace("'", "''"); 
	
		let query =
	 `INSERT INTO cat_outcome(id, name)
			VALUES('${entity.id}', '${entity.name??null}')
	ON DUPLICATE KEY UPDATE
	name='${entity.name ?? null}';`;
	return query.replace(/'null'/g, "null");	
  };

  module.exports = {
	addConversation,
	addParticipant,
	addSession,
	addSegment,
	addConversationMetric,
	addFlowOutcomes,
	addUser,
	addWrapupcode,
	addQueue,
	addCampaing,
	addSkill,
	addContactlist,
	addOutcome
  };
  