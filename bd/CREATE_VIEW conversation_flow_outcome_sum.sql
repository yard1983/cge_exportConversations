USE genesys;

DROP VIEW IF EXISTS conversation_flow_outcome_sum;

CREATE VIEW conversation_flow_outcome_sum
AS
	SELECT conversationId, 
	GROUP_CONCAT( if(name='Atacama',value,NULL) ) AS 'Atacama',
	GROUP_CONCAT( if(name='Bío Bío',value,NULL) ) AS 'Bío Bío',
	GROUP_CONCAT( if(name='ClienteConTicketAbierto',value,NULL) ) AS 'ClienteConTicketAbierto',
	GROUP_CONCAT( if(name='ClienteSinInfoComercial',value,NULL) ) AS 'ClienteSinInfoComercial',
	GROUP_CONCAT( if(name='ComercialOp2',value,NULL) ) AS 'ComercialOp2',
	GROUP_CONCAT( if(name='Coquimbo',value,NULL) ) AS 'Coquimbo',
	GROUP_CONCAT( if(name='CrearTicketAutomatico',value,NULL) ) AS 'CrearTicketAutomatico',
	GROUP_CONCAT( if(name='EmergenciasOp1',value,NULL) ) AS 'EmergenciasOp1',
	GROUP_CONCAT( if(name='EscuchoInformacion',value,NULL) ) AS 'EscuchoInformacion',
	GROUP_CONCAT( if(name='InformaConDeuda',value,NULL) ) AS 'InformaConDeuda',
	GROUP_CONCAT( if(name='InformaCortePorDeuda',value,NULL) ) AS 'InformaCortePorDeuda',
	GROUP_CONCAT( if(name='InformaSaldoAFavor',value,NULL) ) AS 'InformaSaldoAFavor',
	GROUP_CONCAT( if(name='InformaSinDeuda',value,NULL) ) AS 'InformaSinDeuda',
	GROUP_CONCAT( if(name='InformaUltimoPagoRegistrado',value,NULL) ) AS 'InformaUltimoPagoRegistrado',
	GROUP_CONCAT( if(name='Libertador O''Higgins',value,NULL) ) AS 'Libertador O''Higgins',
	GROUP_CONCAT( if(name='Maule',value,NULL) ) AS 'Maule',
	GROUP_CONCAT( if(name='Metropolitana',value,NULL) ) AS 'Metropolitana',
	GROUP_CONCAT( if(name='NroClienteValido',value,NULL) ) AS 'NroClienteValido',
	GROUP_CONCAT( if(name='PasoAgenteIVRComercial',value,NULL) ) AS 'PasoAgenteIVRComercial',
	GROUP_CONCAT( if(name='PasoAgenteSinInfoTicket',value,NULL) ) AS 'PasoAgenteSinInfoTicket',
	GROUP_CONCAT( if(name='PasoAgenteSinNroCliente',value,NULL) ) AS 'PasoAgenteSinNroCliente',
	GROUP_CONCAT( if(name='PasoAgenteTicketAbierto',value,NULL) ) AS 'PasoAgenteTicketAbierto',
	GROUP_CONCAT( if(name='SP_ConsultaTicket',value,NULL) ) AS 'SP_ConsultaTicket',
	GROUP_CONCAT( if(name='Tarapacá',value,NULL) ) AS 'Tarapacá',
	GROUP_CONCAT( if(name='V_ActivaCorteDeudaListaRepo',value,NULL) ) AS 'V_ActivaCorteDeudaListaRepo',
	GROUP_CONCAT( if(name='V_ActivaOtrasConsultas',value,NULL) ) AS 'V_ActivaOtrasConsultas',
	GROUP_CONCAT( if(name='V_CierraPasoTicket',value,NULL) ) AS 'V_CierraPasoTicket',
	GROUP_CONCAT( if(name='V_CierraTrfAgenteTicket',value,NULL) ) AS 'V_CierraTrfAgenteTicket',
	GROUP_CONCAT( if(name='V_CierreAtComercial',value,NULL) ) AS 'V_CierreAtComercial',
	GROUP_CONCAT( if(name='V_NroCliente',value,NULL) ) AS 'V_NroCliente',
    GROUP_CONCAT( if(name='WS_ActualizaEstadoTicket',value,NULL) ) AS 'WS_ActualizaEstadoTicket',
    GROUP_CONCAT( if(name='WS_ConsultarEmpresaQueryResponse',value,NULL) ) AS 'WS_ConsultarEmpresaQueryResponse',
    GROUP_CONCAT( if(name='WS_ConsultarOrdenReconexion',value,NULL) ) AS 'WS_ConsultarOrdenReconexion',
    GROUP_CONCAT( if(name='WS_ConsultarUltimoPago',value,NULL) ) AS 'WS_ConsultarUltimoPago',
    GROUP_CONCAT( if(name='WS_ConsultaTicket',value,NULL) ) AS 'WS_ConsultaTicket',
    GROUP_CONCAT( if(name='WS_GeneraTicket',value,NULL) ) AS 'WS_GeneraTicket',
    GROUP_CONCAT( if(name='WS_HA_ConsultaCentrality',value,NULL) ) AS 'WS_HA_ConsultaCentrality',
    GROUP_CONCAT( if(name='WS_HA_ObtenerInfoCliente',value,NULL) ) AS 'WS_HA_ObtenerInfoCliente',
    GROUP_CONCAT( if(name='WS_ObtenerToken',value,NULL) ) AS 'WS_ObtenerToken',
    GROUP_CONCAT( if(name='WS_ObtieneInfoCliente',value,NULL) ) AS 'WS_ObtieneInfoCliente',
    GROUP_CONCAT( if(name='WS_ObtieneInterrupcionesCliente',value,NULL) ) AS 'WS_ObtieneInterrupcionesCliente'    
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
