let globalCounter = 0;

function incrementCounter() {
    globalCounter++;
}

function getCounter() {
    return globalCounter;
}

function decrementCounter() {
    if (globalCounter !== 0){
        globalCounter--;
    }
    
}

function resetCounter() {
    globalCounter = 0;
}

module.exports = {
    incrementCounter,
    getCounter,
    decrementCounter,
    resetCounter
}