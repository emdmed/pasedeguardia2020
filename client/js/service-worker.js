
let pendienteAlarms = [];

onmessage = e => {
    const message = JSON.parse(e.data);
    pendienteAlarms.push(message[0]);
};

setInterval(() => {
    let nowDate = new Date();
    let nowHs = nowDate.getHours();
    let nowMins = nowDate.getMinutes();
    console.log(nowHs, nowMins);
    console.log("pendientealarms", pendienteAlarms)
    pendienteAlarms.forEach(element=>{
        console.log("element inittime ",element.initTime)
        //console.log(parseInt(element.initTime.hs), nowHs, parseInt(element.initTime.min), nowMins)
        if(parseInt(element.initTime.hs) === nowHs && parseInt(element.initTime.min) === nowMins){
            console.log("Notificated")
            postMessage(element.title)

            notifyMe("hola")
            //remove alarm from array
            pendienteAlarms = removeAlarm(element.alarmID, pendienteAlarms);
            console.log("pendiente alarms", pendienteAlarms);
        }

    })

    //continuar
    
}, 60000);


setTimeout(() => {
    postMessage("hola")
}, 6000);

setTimeout(() => {
    postMessage("hola")
    notifyMe("hola")
}, 8000);



function notifyMe(title) {
    ServiceWorkerRegistration.showNotification("pendientes!", {
        body: title
    });
}

function showNotification(title) {
    self.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
          self.registration.showNotification('Pendiente!', {
            body: title
          });
        });
      }
    });
}

//ServiceWorkerRegistration.showNotification()

function removeAlarm(alarmID, pendienteAlarms){
    let array = pendienteAlarms.filter(function(a){return a.alarmID !== alarmID})
    return array
}