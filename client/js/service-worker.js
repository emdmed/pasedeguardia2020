
let pendienteAlarms = [];

onmessage = e => {
    const message = JSON.parse(e.data);
    console.log(message);
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

function notifyMe(title) {
        // check if permission is already granted
        Notification.requestPermission(function(result) {
            if (result === 'granted') {
              navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification("pendientes!", {
                    body: title
                });
              });
            }
          });
 
}

function showNotification(title) {
    Notification.requestPermission(function(result) {
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