function textWrite(txt, cm, speed, lineStart = null, lineEnd = null, preValue = '') {
    return new Promise((resolve) => {
        let i = 0;
        // console.log(txt, lineStart, lineEnd, preValue); 
        if (preValue != '') {
            // console.log(0);
            
            // cm.setValue(preValue);  
            let interval = setInterval(() => {
                if(i > txt.length - 2){
                    clearInterval(interval);
                    resolve();
                }
                cm.replaceRange(txt[i] , {line: lineStart, ch:i});
                i++;
                
            }, speed);
        } else {

            let interval = setInterval(() => {
                // console.log(1);
                cm.setValue(txt.slice(0, i));
                i++;
                if(i > txt.length){
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        }
    })
}

async function writeText(txtList, cm, speed = 100, lineStart = null, lineEnd = null, preValue = '') {
    for (let i = 0; i < txtList.length; i++) {
        await textWrite(txtList[i], cm, speed, lineStart, lineEnd, preValue);
    }
}