var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

/**
 * start a cluster. 
 *
 * @param workerFn              - required, a function to invoke on worker processes
 *
 * @param masterFn              - optional, will be fired after forking code on master has run
 *
 * @param reforkOnDeath         - optional, whether to refork processes when a worker dies, defaults to false
 *
 * @param workersToCoresRatio   - optional, workers to cores ratio expressed in numerical notation 
 *                                (i.e 0.5 = 50% of the cores etc.), default is 1 (100%). In any case there will
 *                                always be a minimum of one worker. You can specify a value over 100%. The calculation
 *                                will round the result down (i.e on a system with 5 cores, 0.5 will be rounded down to 2)
 *
 * @param workersCount          - optional, en explicit number of worker to start, this will override workersToCoresRatio.
 *                                as with workerstoCoresRation a minumum of 1 worker is enforced.
 * 
 * @param workerDeathCallback   - optional, a callback to invoke on worker death. specifying this param will override
 *                                reforkOnDeath behavior.
 *
 * usage example: 
 *
 *  clusterize(function() {
 *     console.log('worker');
 *  }, 0.5);
 * 
 * on a 4 cores system will (eventually) print 'worker' twice;
 */
function clusterize(workerFn, masterFn, reforkOnDeath, workersToCoresRatio, workersCount, workerDeathCallback) {
    
    if (cluster.isMaster) {        
        
        //cluster.setupMaster({silent: true});
        
        if (typeof(reforkOnDeath) === 'undefined') reforkOnDeath = true;
        
        var _finalCount = numCPUs;

        if (workersToCoresRatio) 
            _finalCount = Math.floor(numCPUs * workersToCoresRatio);
            
        if (workersCount) 
            _finalCount = workersCount;
            
        _finalCount = Math.max(_finalCount, 1); // minimum of 1 worker.
        
        console.log('cluster size is %s', _finalCount);

        for (var i = 0; i < _finalCount; i++) {
            console.log('spawning worker # %s', i);
            cluster.fork();
        }
        
        var onDeathCallback = function(worker) {
            if (reforkOnDeath) {
                console.log('worker %s has died, respawning', worker.pid);
                cluster.fork();    
            }
        };

        if (workerDeathCallback)
            onDeathCallback = workerDeathCallback;

        cluster.on('exit', onDeathCallback);

        if (masterFn)
            masterFn();

    } else {
        
        workerFn();
    }
}

module.exports = clusterize;
