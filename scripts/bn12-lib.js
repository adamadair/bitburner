
const BITNODE_STATE_FILE = "/Temp/bn12-state.txt";
const READY_TO_DESTROY_FILE = "/Temp/bn12-ready-to-die.txt";

/** @param {NS} ns **/
export function BitnodeState(ns) {
    let player = ns.getPlayer();
    this.bitnode = player.bitNodeN;
    this.phase = 0;
}

/**
 * Write our current state of the bitnode progress.
 * @param {NS} ns
 * @param {BitnodeState} bitnodeState
 **/
export async function saveBitnodeState(ns, bitnodeState) {
    let text = JSON.stringify(bitnodeState);
    await ns.write(BITNODE_STATE_FILE, text, "w");
}

/**
 * Get the current saved state of the bitnode progress
 * @param {NS} ns
 * @returns {Promise<BitnodeState>}
 */
export async function getBitnodeState(ns) {
    let text = await ns.read(BITNODE_STATE_FILE);
    return text;
}

/**
 * Attempt to purchase all the darkweb programs
 * @param {NS} ns
 */
export function doDarkWebBusiness(ns) {
    ns.purchaseTor();
    let programs = ns.getDarkwebPrograms();
    for (let p of programs) {
        ns.purchaseProgram(p);
    }
}

/**
 * Gets the next most expensive augemtnation available from a faction that
 * the player can afford.
 * 
 * @param {import(".").NS} ns
 * @param {String} faction faction name
 * @param {String} type type of augmentation 'hack', 'combat', 'any'
 */
export function getNextAugmentation(ns, faction, type) {

}

/**
 * 
 * @param {import(".").NS} ns
 * @param {string} script 
 * @param  {...any} args 
 */
export function runScript(ns, script, ...args) {
    if (isRunning(ns, script, ...args)) {
        return;
    }
    ns.run(script, 1, ...args);
}

/**
 * 
 * @param {import(".").NS} ns
 * @param {string} script 
 * @param  {...any} args 
 */
export function isRunning(ns, script, ...args) {
    let processes = ns.ps("home");
    for (let p of processes) {
        if (p.filename == script) {
            if (args.length = p.args.length) {
                for (let i = 0; i < args.length; ++i) {
                    if (args[i] != p.args[i]) {
                        continue;
                    }
                }
                return true;
            }
        }
    }
    return false;
}

/**
 * SleeveOrder type
 * @param {number} sleeveNumber 
 * @param {string} type 'travel', 'crime', 'gym', 'recovery', 'bladeburner', "company", "faction"
 * @param  {...any} args 
 */
export function SleeveOrder(sleeveNumber, type, ...args) {
    this.sleeveNumber = sleeveNumber;
    this.type = type;
    this.args = [...args];
}

/**
 * execute the sleeve order
 * @param {import(".").NS} ns
 * @param {SleeveOrder} SleeveOrder 
 */
export function executeSleeveOrder(ns, sleeveOrder) {

    let sn = sleeveOrder.sleeveNumber;
    let type = sleeveOrder.type;
    let args = sleeveOrder.args;

    if (type === "travel") {
        ns.sleeve.travel(sn, args[0]);
    }

    if (type === "crime") {
        ns.sleeve.setToCommitCrime(sn, args[0]);
    }

    if (type === "gym") {
        ns.sleeve.setToGymWorkout(sn, args[0], args[1]);
    }

    if (type === "recovery") {
        ns.sleeve.setToShockRecovery(sn);
    }

    if(type === "bladeburner"){
        ns.sleeve.setToBladeburnerAction(sn, args[0], args[1]);
    }

    if(type === "faction"){
        ns.sleeve.setToFactionWork(sn, args[0], args[1]);
    }

    if(type === "company"){
        ns.sleeve.setToCompanyWork(sn, args[0]);
    }

    if(type === "university"){
        ns.sleeve.setToUniversityCourse(sn, args[0], args[1]);
    }
}

/**
 * Write the file that is used to signal that the bitnode is ready to be destroyed
 * @param {import(".").NS} ns
 * @returns {Promise<void>}
 */
export async function signalBitNodeReadyToDie(ns){
    await ns.write(READY_TO_DESTROY_FILE,"true","w");
}

/**
 * returns true if the bitnode is ready to be destroyed
 * @param {import(".").NS} ns
 * @returns {boolean}
 */
export function isBitNodeReadyToDie(ns){
    return ns.fileExists(READY_TO_DESTROY_FILE,"home");
}

/**
 * 
 * @param {import(".").NS} ns
 */
export function pimpOutHomeSystem(ns){
    let p = "";
    do {        
        let money = ns.getServerMoneyAvailable("home");
        let c = ns.singularity.getUpgradeHomeRamCost();
        p = "ram";
        if(c > ns.singularity.getUpgradeHomeCoresCost()){
            c = ns.singularity.getUpgradeHomeCoresCost();
            p = "cores";
        }
        if(money >= c){
            switch(p){
                case "ram":
                    ns.singularity.upgradeHomeRam();
                    break;
                default:
                    ns.singularity.upgradeHomeCores();
                    break;
            }
        } else {
            p ="";
        }
    } while(p!=="")
}

/**
 * join factions
 * @param {import(".").NS} ns
 */
export function acceptFactionInvitations(ns) {
    let factions = ns.singularity.checkFactionInvitations();
    for(let faction of factions){
        ns.singularity.joinFaction(faction);
    }    
}
