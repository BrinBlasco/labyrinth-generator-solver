function setIntervalAwaitable(callback, interval){
    return new Promise(resolve => {
        let intervalId = setInterval(() => {
            let shouldStop = callback(); 
            // kdr funkcija vrne karkoli (true v tem primeru alpa false se shrani sm)
            // ce je true, se promise resolva in interval cleara.
            if(shouldStop) {
                clearInterval(intervalId);
                resolve();
            }
        }, interval)
    })
}