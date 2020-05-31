
let pendienteAlarms = [];


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
            showNotification(element.title)
            //remove alarm from array
            pendienteAlarms = removeAlarm(element.alarmID, pendienteAlarms);
            console.log("pendiente alarms", pendienteAlarms);
        }

    })

    //continuar
    
}, 60000);

setTimeout(() => {
    ServiceWorkerRegistration.showNotification("hola", {
        body: "holiii"
    }) 
}, 5000);

function notifyMe(title) {

    // check if permission is already granted
    if (Notification.permission === 'granted') {
        // show notification here
        self.registration.showNotification("Pendiente!", {
            body: title
        })
    } else {
        // request permission from user
        Notification.requestPermission().then(function (p) {
            if (p === 'granted') {
                // show notification here
                self.registration.showNotification("Pendiente!", {
                    body: title
                })
            } else {
                console.log('User blocked notifications.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    }
}

function showNotification(title) {
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            var notify = new Notification('Pendiente!', {
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