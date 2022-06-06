const sendResponse = require('../common/utils/utils').sendResponse
const status = require('../common/constants/statusCodes')
const purecloud = require('../common/controllers/purecloud')
const dbmysql = require('../common/controllers/dbmysql')
const queries = require('../common/auxiliars/queries')

exports.index = async (event) => {     
    let pageSize = 500;
    /*
    const clientId = process.env.CLIENT_ID;
    const secret = process.env.CLIENT_SECRET;
    const environment = process.env.ENVIRONMENT;  
   */
    const clientId = "1e14caef-0509-4b78-927f-adf213e128dc";
    const secret = "28P3t8zx1JVmzEFd7fpa6_U2S6S0NQVlRccd76Wd9rw";
    const environment = "mypurecloud.com";

    if(process.env.PAGE_SIZE)
        pageSize = process.env.PAGE_SIZE; 
       
    try {
        const tokenResponse = await purecloud.getToken(environment, clientId, secret)
        if (!tokenResponse || !JSON.parse(tokenResponse).access_token)
            return sendResponse(status.InternalServerError, { message: "Unable to retrieve a token" })

        const token = JSON.parse(tokenResponse).access_token       
        
        console.log('Starting to download catalogs')        
        await getCatalog(environment, token, "users", "users", pageSize);
        await getCatalog(environment, token, "wrapupcodes", "routing/wrapupcodes", pageSize);
        await getCatalog(environment, token, "queues", "routing/queues", pageSize);
        await getCatalog(environment, token, "campaigns", "outbound/campaigns", pageSize);
        await getCatalog(environment, token, "skills", "routing/skills", pageSize);
        await getCatalog(environment, token, "contactlists", "outbound/contactlists", pageSize); 
        await getCatalog(environment, token, "outcomes", "flows/outcomes", pageSize);        
        
    } catch (error) {
        if(error.message)
            error=error.message       
        console.error(`#CriticalAlarm: ${error}`)         
        return sendResponse(status.InternalServerError, { error })
    } finally {   
        console.info("Process finished");
        dbmysql.closeConnection();    
    }
};

const getCatalog = async function (environment, token, catalog, path, pageSize){
    let pageNumber=1 
    let response={}      
    do {
        response = await purecloud.getCatalog(environment, token, path, pageNumber, pageSize);

        if(response && response.entities) {
            console.log(`page: ${pageNumber} total: ${response.entities.length} - ${path}`) 
            let query = '';            
            for(const entity of response.entities) { 
                query += saveCatalog(entity, catalog);
            } 
            
            if(query){
                //adding default wrapup code for all orgs
                if(catalog=='wrapupcodes')
                    query += saveCatalog({id: "7fb334b0-0e9e-11e4-9191-0800200c9a66", name: "Default Wrap-up Code"}, catalog);                
                
                await dbmysql.executeQuery(query);
            }                
        }
        pageNumber++
    } while (response.entities && response.entities.length == pageSize);

}

function saveCatalog(entity, catalog)
{
    switch(catalog){
        case "users":
            return queries.addUser(entity);            
        case "wrapupcodes":
            return queries.addWrapupcode(entity);
        case "queues":
            return queries.addQueue(entity);
        case "campaigns":
            return queries.addCampaing(entity);            
        case "skills":
            return queries.addSkill(entity);            
        case "contactlists":
            return queries.addContactlist(entity);
        case "outcomes":
            return queries.addOutcome(entity);
        default:
            return "";
    }    
}
(async()=> { await exports.index() } )()