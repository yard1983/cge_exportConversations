USE genesys;

DROP VIEW IF EXISTS conversation_service;

CREATE VIEW conversation_service
AS
	SELECT conversationId, 
	GROUP_CONCAT( if(name='Tarapacá',value,NULL) ) AS 'Tarapaca',
	GROUP_CONCAT( if(name='Antofagasta',value,NULL) ) AS 'Antofagasta',
	GROUP_CONCAT( if(name='Atacama',value,NULL) ) AS 'Atacama',
	GROUP_CONCAT( if(name='Coquimbo',value,NULL) ) AS 'Coquimbo',
	GROUP_CONCAT( if(name='Valparaíso',value,NULL) ) AS 'Valparaiso',
	GROUP_CONCAT( if(name='Libertador O''Higgins',value,NULL) ) AS 'Libertador_Higgins',
	GROUP_CONCAT( if(name='Maule',value,NULL) ) AS 'Maule',
	GROUP_CONCAT( if(name='Bío Bío',value,NULL) ) AS 'Bio_Bio',
	GROUP_CONCAT( if(name='Araucanía',value,NULL) ) AS 'Araucania',
	GROUP_CONCAT( if(name='Magallanes y Antártica',value,NULL) ) AS 'Magallanes',
	GROUP_CONCAT( if(name='Metropolitana',value,NULL) ) AS 'Metropolitana',
	GROUP_CONCAT( if(name='Arica y Parinacota',value,NULL) ) AS 'Arica_Parinacota',  
    GROUP_CONCAT( if(name='Aysén',value,NULL) ) AS 'Aysen',
    GROUP_CONCAT( if(name='Los Lagos',value,NULL) ) AS 'Los_Lagos',   
    GROUP_CONCAT( if(name='Los Rios',value,NULL) ) AS 'Los_Rios',  
    GROUP_CONCAT( if(name='Ñuble',value,NULL) ) AS 'Ñuble'   
    
	FROM
	(
		SELECT DISTINCT
		conversation.conversationId as conversationId,
		name,
		flowOutcomeValue as value
		FROM conversation
		INNER JOIN participant on (participant.conversationId = conversation.conversationId)
		INNER JOIN session on (session.participantId = participant.participantId)
		INNER JOIN flow_outcome on (flow_outcome.sessionId = session.sessionId)
		INNER JOIN cat_outcome on (cat_outcome.id = flow_outcome.flowOutcomeId)			
	) fo
	GROUP BY conversationId;
