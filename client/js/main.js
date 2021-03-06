let STOREDPATIENTS

moment.locale('es')

let pendienteAlarms = [];
/*
setInterval(() => {
    let nowDate = new Date();
    let nowHs = nowDate.getHours();
    let nowMins = nowDate.getMinutes();
    console.log(nowHs, nowMins);
    pendienteAlarms.forEach(element=>{
        console.log(element.initTime)
        console.log(parseInt(element.initTime.hs), nowHs, parseInt(element.initTime.min), nowMins)
        if(parseInt(element.initTime.hs) === nowHs && parseInt(element.initTime.min) === nowMins){
            console.log("Notificated")
            notifyMe(element.title);
            //remove alarm from array
            pendienteAlarms = removeAlarm(element.alarmID, pendienteAlarms);
            console.log("pendiente alarms", pendienteAlarms);
        }

    })

    //continuar
    
}, 60000);*/




function removeAlarm(alarmID, pendienteAlarms) {
    let array = pendienteAlarms.filter(function (a) { return a.alarmID !== alarmID })
    return array
}

function checkAndLoadExistingPatients() {
    let storage = getStoredPatients();

    if (!storage) {
        //agregar el primer paciente?
        console.log("No stored patients")
        STOREDPATIENTS = [];
    } else {
        //render localstorage
        STOREDPATIENTS = storage;
    }
}

$("body").on("click", "#create_patient_btn", function () {


    let name = $("#patient_name").val();
    let age = $("#patient_age").val();
    let bed = $("#patient_bed").val();
    let newPatient = createPatientModel(name, age, bed);
    //validate name ONLY 3 LETTERS
    if (name.length > 3) {
        alert("La identificación del paciente sólo puede tener hasta 3 letras")
    } else {
        newPatient.info.name = name;
        newPatient.info.age = age;
        newPatient.info.bed = bed;
        newPatient.info.id = name + bed + age

        //push to soterdpatients array and save to localstorage
        STOREDPATIENTS.push(newPatient);
        console.log(STOREDPATIENTS);
        localStorage.setItem("patients", JSON.stringify(STOREDPATIENTS));

        //close modal
        $("#clinic_triage_modal").modal("hide");

        renderPatientCards();

    }
})

$("body").on("click", "#see_patients_btn", function () {

    let patientList = getStoredPatients();
    $(".small_patient_container_onsidebar").empty();

    if ($(this).attr("class") === "nav-link collapsed" || $(this).attr("class") === "nav-link") {
        patientList.forEach(element => {
            /*
            $(".small_patient_container_onsidebar").append(`
                <a class="collapse-item active display_patient_button sidebarToggleTop" data-toggle="collapse" data-target="#collapseTwo" id="${element.info.id}">${element.info.bed} ${element.info.name}</a>
            `)*/

            $(".small_patient_container_onsidebar").append(`
                <div class="form-row">
                    <a class="collapse-item active text-danger delete_patient" id="${element.info.id}">x</a>
                    <a class="collapse-item active display_patient_button sidebarToggleTop" data-toggle="collapse" data-target="#collapseTwo" id="${element.info.id}">${element.info.bed} ${element.info.name}</a>
                </div>
            `)
        })
    }

})

renderPatientCards();

//render patient cards
function renderPatientCards() {
    let patientList = JSON.parse(localStorage.getItem("patients"));

    $("#patient_cards_here").empty();

    patientList.forEach(element => {
        /*
        $(".small_patient_container_onsidebar").append(`
            <a class="collapse-item active display_patient_button sidebarToggleTop" data-toggle="collapse" data-target="#collapseTwo" id="${element.info.id}">${element.info.bed} ${element.info.name}</a>
        `)*/

        $("#patient_cards_here").append(`
            <div class="card bg-primary mt-2 mx-2 display_patient_button" id="${element.info.id}">
                <div class="card-body p-2">
                    <div class="container-fluid">
                
                        <div class="row">

                            <div class="col text-center">
                                <p class="mb-0 text-white"><small>Cama</small></p>
                                <h4 class="text-white mb-0">${element.info.bed}</h4>
                            </div>
                            <div class="col text-center">
                                <p class="mb-0 text-white"><small>Nombre</small></p>
                                <h4 class="text-white mb-0">${element.info.name}</h4>
                            </div>
                            <div class="col text-center">
                                <p class="mb-0 text-white"><small>Edad</small></p>
                                <h4 class="text-white mb-0">${element.info.age}</h4>
                            </div>
                            <div class="col text-center my-auto">
                                <p class="mb-0 text-white"><small>Pendientes</small></p>
                                <p class="text-white mb-0">${element.pendientes.length}</p>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        `)
    })
}


function getStoredPatients() {
    let stored = JSON.parse(localStorage.getItem("patients"))
    return stored;
}

function createPatientModel(name, age, bed) {
    let newpatient = {
        info: {
            bed: bed,
            age: age,
            name: name,
            id: name + bed + age
        },
        atc: [],
        mi: "",
        controls: [],
        pendientes: []
    }

    return newpatient;
}

$("body").on("click", ".display_patient_button", function () {

    let id = $(this).attr("id");
    console.log(id);

    let patientList = getStoredPatients();

    let found = false;

    patientList.forEach(element => {
        if (element.info.id === id) {
            found = element;
        } else {
        }
    })

    console.log(found);

    if (found === false) {

    } else {
        $("#patient_cards_here").empty();
        renderPatientCard(found);

        $("#collapseTwo").collapse();
    }

})

function renderPatientCard(patient) {
    $("#patient_cards_here").append(`
    
        <div class="container-fluid entrance-scale p-0">
            <div class="row my-auto patient-title">

                <div class="col mx-auto text-center">
                    <p class="text-primary mb-0 mx-auto"><small>Cama</small></p>
                    <h4 class="text-dark my-auto mx-auto change_bed" id="${patient.info.id}">${patient.info.bed}</h4>
                </div>
                <div class="col mx-auto text-center">
                    <p class="text-primary mb-0 mx-auto"><small>Paciente</small></p>
                    <h4 class=" text-dark my-auto mx-auto">${patient.info.name}</h4>
                </div>
                <div class="col mx-auto text-center">
                    <p class="text-primary mb-0 mx-auto"><small>Edad</small></p>
                    <h4 class=" text-dark my-auto mx-auto">${patient.info.age}</h4>
                </div>
   
            </div>

            <br>
            
            <div class="row mx-3">
                <div class="card w-100 mi-border-card">
                <div class="card-header bg-white set_mi closed" id="${patient.info.id}">
                    <h5 class="text-primary">Motivo de internación</h5>
                </div>
                    <div class="card-body"">
                    <textarea class="mi_textarea form-control" style="display:none" placeholder="Escribir aqui..."></textarea>
                    <p class="mi_p_text">${patient.mi}</p>
                    </div>
                </div>
            </div>

            <div class="row mt-2 mx-3">
                <div class="card w-100">
                    <div class="card-header bg-white set_atc closed" id="${patient.info.id}">
                        <h5 class="text-primary">Antecedentes</h5>
                    </div>
                    <div class="card-body">
                        <textarea class="atc_textarea form-control" style="display:none" placeholder="Escribir aqui..."></textarea>
                        <p class="atc_p_text">${patient.atc}</p>
                    </div>
                </div>
            </div>

            <div class="row mt-2 mx-3">
                <div class="card w-100">
                    <div class="card-body">

                        <div class="container-fluid p-1">

                            <div class="row">
                                <div class="col my-auto">
                                    <h5 class="my-auto toggle-controles show text-primary" id="${patient.info.id}">Controles</h5>
                                </div>
                                <div class="col my-auto mx-auto">
                                <button class="mx-auto ml-4 btn btn-primary btn-circle show_controles_modal float-right"  data-toggle="modal" data-target="#controles_modal" id="${patient.info.id}">+</button>
                                </div>
                            </div>

                            <div class="controles_here" id="${patient.info.id}">
                            
                            </div>

                        </div>
                
                    </div>
                </div>
            </div>

            <div class="row mt-2 mx-3">
            <div class="card w-100">
                <div class="card-body">

                    <div class="container-fluid p-1">

                        <div class="row">
                            <div class="col my-auto">
                                <h5 class="my-auto toggle-controles show text-primary" id="${patient.info.id}">Pendientes</h5>
                            </div>
                            <div class="col my-auto">
                            <button class="ml-4 btn btn-primary btn-circle float-right add_pendiente" id="${patient.info.id}">+</button>
                            </div>
                        </div>

                        <div class="pendientes_here" id="${patient.info.id}">
                        
                        </div>

                    </div>
            
                </div>
            </div>
        </div>

        </div>

    `)

    renderControlesFromPatientId(patient.info.id);
    renderPendientesFromPatientId(patient.info.id)
}

$("body").on("click", ".show_controles_modal", function () {
    let id = $(this).attr("id");

    $("#controles_modal").find(".add_control_hemodinamico_btn").attr("id", id);
    $("#controles_modal").find(".add_control_balance_btn").attr("id", id);
    $("#controles_modal").find(".add_control_hgt_btn").attr("id", id);
})

$("body").on("click", ".add_control_hemodinamico_btn", function () {

    $("#controles_modal").modal("hide");

    let id = $(this).attr("id");

    let foundPatient = findPatientById(id);

    if (foundPatient === false) {
        alert("error on finding patient");
    } else {
        let newcontrol = createControlHemodinamico();
        foundPatient.controls.push(newcontrol);
        updateStoredPatientById(id, foundPatient);
        $(".controles_here").empty();
        renderControlesFromPatientId(id);

        //scroll to div
        setTimeout(() => {
            document.getElementById(newcontrol.date).scrollIntoView();
        }, 500);

    }

})

$("body").on("click", ".add_control_hgt_btn", function () {

    $("#controles_modal").modal("hide");

    let id = $(this).attr("id");

    let foundPatient = findPatientById(id);

    let HgtContolCreated = findHgtControlInPatient(foundPatient);
    console.log("HGT found: ", HgtContolCreated);

    if (HgtContolCreated === false) {

        if (foundPatient === false) {
            alert("error on finding patient");
        } else {
            let newcontrol = createControlHgt();
            foundPatient.controls.push(newcontrol);
            updateStoredPatientById(id, foundPatient);
            $(".controles_here").empty();
            renderControlesFromPatientId(id);

            //scroll to div
            setTimeout(() => {
                document.getElementById(newcontrol.date).scrollIntoView();
            }, 500);

        }
    } else {

    }

})

function renderControlesFromPatientId(id) {
    let patientList = getStoredPatients();
    let found = findPatientById(id);

    let balancerendered = false;
    let hgtrendered = false;

    if (!found) {

    } else {
        for (let i = 0; i < found.controls.length; i++) {

            if (found.controls[i].type === "hemodinamico") {

                //check if tas value
                let tasvalue;
                let tadvalue;
                let tamvalue;



                if (found.controls[i].ts === "") {
                    tasvalue = "TAS"
                } else {
                    tasvalue = found.controls[i].ts
                }

                if (found.controls[i].td === "") {
                    tadvalue = "TAD"
                } else {
                    tadvalue = found.controls[i].td
                }

                tamvalue = calcTAM(+found.controls[i].ts, +found.controls[i].td);

                //time
                let time = moment(found.controls[i].date).calendar();

                $(".controles_here").append(`
                    <hr>
                    <div class="row w-100 mt-2 mx-auto control_hemodinamico_row entrance-scale" id="${found.controls[i].date}">
                        <div class="card mx-auto p-1">
                            <div class="card-body p-1 text-center">
                                <h5 class="text-primary">Hemodinamico</h5>
                                <p class="font-weight-lighter font-italic">${time}</p>
    
                                <hr>
                                <div class="form-row text-center mx-auto" id="${i}">
                                    <h5 class="change_tas mx-auto" id="${found.info.id}">${tasvalue}</h5>
                                    <p class="mx-auto">/</p>
                                    <h5 class="change_tad mx-auto" id="${found.info.id}">${tadvalue}</h5>   
                                </div>
                                <p class="tam_value">TAM ${tamvalue.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>
                
                `)
            } else if (found.controls[i].type === "balance" && balancerendered === false) {
                //control balance

                $(".controles_here").append(`
                    <hr>
                    <div class="row w-100 mt-2 mx-auto control_hemodinamico_row entrance-scale" id="${found.controls[i].date}">
                        <div class="card mx-auto p-1 m-2 w-100">
                            <div class="card-body w-100 p-1 text-center">
                                <h5>Balance</h5>
                                <hr>
                                <p>Ingresos VO</p>
                                <div class="form-row text-center mx-auto" id="${i}">
                                    <a class="plus_vo_btn mx-auto" id="${found.info.id}">+</a>
                                    <p class="mx-auto ivo">${found.controls[i].ivo * 200} ml</p>
                                    <a class="minus_vo_btn mx-auto" id="${found.info.id}">-</a>   
                                </div>
                                <p>Ingresos EV</p>
                                <div class="form-row text-center mx-auto" id="${i}">
                                    <a class="plus_ev_btn mx-auto" id="${found.info.id}">+</a>
                                    <p class="mx-auto iev">${found.controls[i].iev * 250} ml</p>
                                    <a class="minus_ev_btn mx-auto" id="${found.info.id}">-</a>   
                                </div>
                                <p>Catarsis</p>
                                <div class="form-row text-center mx-auto" id="${i}">
                                    <a class="plus_cat_btn mx-auto" id="${found.info.id}">+</a>
                                    <p class="mx-auto catarsis">${found.controls[i].cat}</p>
                                    <a class="minus_cat_btn mx-auto" id="${found.info.id}">-</a>   
                                </div>
                                <p>Diuresis</p>
                                <div class="form-row text-center mx-auto" id="${i}">
                                    <a class="plus_diu_btn mx-auto" id="${found.info.id}">+</a>
                                    <p class="mx-auto diuresis">${found.controls[i].diu * 100} ml</p>
                                    <a class="minus_diu_btn mx-auto" id="${found.info.id}">-</a>   
                                </div>
                                <p>Peso en kg</p>
                                <div class="form-row text-center mx-auto" id="${i}">
                              
                                    <p class="mx-auto peso" id="${found.info.id}">${found.controls[i].peso}kg</p>
             
                                </div>
                                <button class="btn btn-sm btn-block btn-outline-primary calcular_balance" id="${found.info.id}">Calcular</button>
                            </div>
                        </div>
                    </div>
                `)

                balancerendered = true

            } else if (found.controls[i].type === "hgt") {
                let sum = +found.controls[i].d.correccion + +found.controls[i].a.correccion + +found.controls[i].m.correccion + +found.controls[i].c.correccion;
                $(".controles_here").append(`
                    <hr>
                    <div class="row w-100 mt-2 mx-auto control_hgt_row entrance-scale" id="${found.controls[i].date}">
                        <div class="card mx-auto p-1 w-100">
                            <div class="card-body p-1 text-center">
                                <div class="container-fluid">
                                    <div class="row mb-2">
                                        <h5 class="mx-auto text-primary">HGT</h5>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <h6 class="font-weight-bold">D</h6>
                                            <p id="${found.info.id}" class="text-primary mb-0 hgtD">${found.controls[i].d.hgt}</p>
                                            <p id="${found.info.id}" class="text-danger correccionD">${found.controls[i].d.correccion}</p>
                                        </div>
                                        <div class="col">
                                            <h6 class="font-weight-bold">A</h6>
                                            <p id="${found.info.id}" class="text-primary mb-0 hgtA">${found.controls[i].a.hgt}</p>
                                            <p id="${found.info.id}" class="text-danger correccionA">${found.controls[i].a.correccion}</p>
                                        </div>
                                        <div class="col">
                                            <h6 class="font-weight-bold">M</h6>
                                            <p id="${found.info.id}" class="text-primary mb-0 hgtM">${found.controls[i].m.hgt}</p>
                                            <p id="${found.info.id}" class="text-danger correccionM">${found.controls[i].m.correccion}</p>
                                        </div>
                                        <div class="col">
                                            <h6 class="font-weight-bold">C</h6>
                                            <p id="${found.info.id}" class="text-primary mb-0 hgtC">${found.controls[i].c.hgt}</p>
                                            <p id="${found.info.id}" class="text-danger correccionC">${found.controls[i].c.correccion}</p>
                                        </div>
                                    </div>
                                    <div class="row mx-auto">
                                    <p class="text-danger mb-0 mx-auto">Correciones</p>
                                    </div>
                                    <div class="row mb-0 mt-0">
                                        <p class="mx-auto">Total: <span class="text-danger correccionSum">${sum}</span></p>
                                    </div>
                            </div>
                            </div>
                        </div>
                    </div>
                `)

                hgtrendered = true;
            }
        }
    }
}

function renderPendientesFromPatientId(id) {
    let found = findPatientById(id);
    if (!found) {

    } else {
        for (let i = 0; i < found.pendientes.length; i++) {

            let priorityColor;

            if (found.pendientes[i].priority === "green") {
                priorityColor = "btn-success"
            } else if (found.pendientes[i].priority === "yellow") {
                priorityColor = "btn-warning"
            } else if (found.pendientes[i].priority === "red") {
                priorityColor = "btn-danger"
            }

            $(".pendientes_here").append(`
                <hr>
                <div class="card p-1 border-primary">
                    <div class="card-body p-1" id="${found.info.id}">
                        <div class="row my-auto">
                            <div class="col text-center">
                            <h5 class="pending_title" id="${i}">${found.pendientes[i].title}</h5>
                            </div>
                            <div class="col text-center">
                            <button class="btn ${priorityColor} btn-sm priority">Prioridad</button>
                            </div>                         
                        </div>

                        <div class="row my-auto pt-3">     
                            <div class="col text-center">
                             
                            </div>                                                                                         
                        </div>
                    </div>
                </div>

            `)
        }
    }
}


$("body").on("click", ".calcular_balance", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let ingresos = +foundBalanceControl.ivo * 200 + +foundBalanceControl.iev * 250;
    let aguaEndogena = +foundBalanceControl.peso / 2 * 10;
    console.log(ingresos, aguaEndogena);

    let totalIngresos = +ingresos + +aguaEndogena;
    console.log("total ingresos ", totalIngresos);

    let egresos = +foundBalanceControl.cat * 200 + +foundBalanceControl.diu * 100;
    console.log(egresos);
    let perdidasInsensibles = +foundBalanceControl.peso * 10;
    console.log(perdidasInsensibles);

    let totalEgresos = +egresos + +perdidasInsensibles;

    let total = +totalIngresos - +totalEgresos;

    $(this).text(total + " ml")


})

$("body").on("click", ".change_tas", function () {

    let id = $(this).attr("id");
    let controlIndex = $(this).parent().attr("id");
    let thisobj = $(this);

    let promptval = prompt("Valor de presión arterial sistólica");

    if (promptval === null) {
        $(this).text("TAS");
    } else {
        $(this).text(promptval);
        //save on patient and localstorage
        let thisPatient = findPatientById(id);
        console.log(thisPatient, id);
        //rewrite ts value
        if (!thisPatient || thisPatient === undefined || thisPatient === null) {
            alert("Error at retrieving patient");
        } else {


            thisPatient.controls[controlIndex].ts = promptval
            updateStoredPatientById(id, thisPatient);

            if (thisPatient.controls[controlIndex].ts > 0 && thisPatient.controls[controlIndex].td > 0) {
                console.log("TAS ", calcTAM(thisPatient.controls[controlIndex].ts, thisPatient.controls[controlIndex].td).toFixed(0));
                let tam = calcTAM(thisPatient.controls[controlIndex].ts, thisPatient.controls[controlIndex].td).toFixed(0);
                thisPatient.controls[controlIndex].tam = tam;

                //render on frontend
                $(thisobj).parent().parent().find(".tam_value").text("TAM " + tam);
            }


        }
    }


})


$("body").on("click", ".change_tad", function () {

    let id = $(this).attr("id");
    let controlIndex = $(this).parent().attr("id");
    let thisobj = $(this);

    let promptval = prompt("Valor de presión arterial diastólica");

    if (promptval === null) {
        $(this).text("TAD");
    } else {
        $(this).text(promptval);
        //save on patient and localstorage
        let thisPatient = findPatientById(id);
        console.log(thisPatient, id);
        //rewrite ts value
        if (!thisPatient || thisPatient === undefined || thisPatient === null) {
            alert("Error at retrieving patient");
        } else {


            thisPatient.controls[controlIndex].td = promptval
            updateStoredPatientById(id, thisPatient);

            if (thisPatient.controls[controlIndex].ts > 0 && thisPatient.controls[controlIndex].td > 0) {
                console.log("TAD ", calcTAM(thisPatient.controls[controlIndex].ts, thisPatient.controls[controlIndex].td).toFixed(0));
                let tam = calcTAM(thisPatient.controls[controlIndex].ts, thisPatient.controls[controlIndex].td).toFixed(0);
                thisPatient.controls[controlIndex].tam = tam;

                //render on frontend
                $(thisobj).parent().parent().find(".tam_value").text("TAM " + tam);
            }

        }
    }
})

$("body").on("click", ".plus_vo_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.ivo + 1;
    foundBalanceControl.ivo = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".ivo").text(foundBalanceControl.ivo * 200 + " ml")
    $(".ivo").attr("class", "mx-auto ivo animateText1")
    setTimeout(() => {
        $(".ivo").attr("class", "mx-auto ivo")
    }, 200);
})

$("body").on("click", ".minus_vo_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.ivo - 1;
    foundBalanceControl.ivo = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".ivo").text(foundBalanceControl.ivo * 200 + " ml")
    $(".ivo").attr("class", "mx-auto ivo animateText1")
    setTimeout(() => {
        $(".ivo").attr("class", "mx-auto ivo")
    }, 200);

})


$("body").on("click", ".plus_ev_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.iev + 1;
    foundBalanceControl.iev = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".iev").text(foundBalanceControl.iev * 250 + " ml")
    $(".iev").attr("class", "mx-auto iev animateText1")
    setTimeout(() => {
        $(".iev").attr("class", "mx-auto iev")
    }, 200);
})

$("body").on("click", ".minus_ev_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.iev - 1;
    foundBalanceControl.iev = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".iev").text(foundBalanceControl.iev * 250 + " ml")
    $(".iev").attr("class", "mx-auto iev animateText1")
    setTimeout(() => {
        $(".iev").attr("class", "mx-auto iev")
    }, 200);
})

$("body").on("click", ".plus_cat_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.cat + 1;
    foundBalanceControl.cat = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".catarsis").text(foundBalanceControl.cat)
    $(".catarsis").attr("class", "mx-auto catarsis animateText1")
    setTimeout(() => {
        $(".catarsis").attr("class", "mx-auto catarsis")
    }, 200);
})

$("body").on("click", ".minus_cat_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.cat - 1;
    foundBalanceControl.cat = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".catarsis").text(foundBalanceControl.cat)
    $(".catarsis").attr("class", "mx-auto catarsis animateText1")
    setTimeout(() => {
        $(".catarsis").attr("class", "mx-auto catarsis")
    }, 200);
})

$("body").on("click", ".plus_diu_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.diu + 1;
    foundBalanceControl.diu = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".diuresis").text(foundBalanceControl.diu * 100 + " ml")
    $(".diuresis").attr("class", "mx-auto diuresis animateText1")
    setTimeout(() => {
        $(".diuresis").attr("class", "mx-auto diuresis")
    }, 200);
})

$("body").on("click", ".minus_diu_btn", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);

    let sum = +foundBalanceControl.diu - 1;
    foundBalanceControl.diu = sum;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

    //frontend
    $(".diuresis").text(foundBalanceControl.diu * 100 + " ml")
    $(".diuresis").attr("class", "mx-auto diuresis animateText1")
    setTimeout(() => {
        $(".diuresis").attr("class", "mx-auto diuresis")
    }, 200);
})

$("body").on("click", ".peso", function () {

    let peso = prompt("Ingrese el peso del paciente");

    $(this).text(peso + " kg");
    $(this).attr("class", "mx-auto peso animateText1")
    setTimeout(() => {
        $(".peso").attr("class", "mx-auto peso")
    }, 200);

    //localstorage
    let id = $(this).attr("id");

    let patient = findPatientById(id);
    let balanceIndex = findBalanceControlIndexInPatient(patient);


    let foundBalanceControl = findBalanceInPatient(patient);
    foundBalanceControl.peso = peso;

    patient.controls[balanceIndex] = foundBalanceControl;
    updateStoredPatientById(id, patient);

})


$("body").on("click", ".set_mi", function () {
    let id = $(this).attr("id");

    if ($(this).attr("class") === "card-header bg-white set_mi closed") {

        $(".mi_textarea").show("fast");
        $(this).attr("class", "card-header bg-white set_mi opened")
        $(".mi_p_text").hide();

    } else if ($(this).attr("class") === "card-header bg-white set_mi opened") {
        //take value and render in <p> element

        let text = $(".mi_textarea").val();
        $(".mi_textarea").hide();
        $(".mi_p_text").show("fast");
        $(".mi_p_text").text(text);

        $(this).attr("class", "card-header bg-white set_mi closed")

        //save lo localstorage

        let thisPatient = findPatientById(id)
        thisPatient.mi = text;
        updateStoredPatientById(id, thisPatient);

    }
})

$("body").on("click", ".set_atc", function () {
    let id = $(this).attr("id");

    if ($(this).attr("class") === "card-header bg-white set_atc closed") {

        $(".atc_textarea").show("fast");
        $(this).attr("class", "card-header bg-white set_atc opened")
        $(".atc_p_text").hide();

    } else if ($(this).attr("class") === "card-header bg-white set_atc opened") {
        //take value and render in <p> element

        let text = $(".atc_textarea").val();
        $(".atc_textarea").hide();
        $(".atc_p_text").show("fast");
        $(".atc_p_text").text(text);

        $(this).attr("class", "card-header bg-white set_atc closed")

        let thisPatient = findPatientById(id)
        thisPatient.atc = text;
        updateStoredPatientById(id, thisPatient);

    }
})

$("body").on("click", ".add_control_balance_btn", function () {

    $("#controles_modal").modal("hide");

    let id = $(this).attr("id");

    let foundPatient = findPatientById(id);
    console.log("found ", foundPatient);

    let isThereBalanceControl = findBalanceInPatient(foundPatient);

    if (isThereBalanceControl === false) {
        if (foundPatient === false) {
            alert("error on finding patient");
        } else {
            let newcontrol = createControlBalance();
            foundPatient.controls.push(newcontrol);
            updateStoredPatientById(id, foundPatient);
            $(".controles_here").empty();
            renderControlesFromPatientId(id);
        }

    } else { }

})


//con el segundo paciente no puedo cargar ningun control ERROR EN ESTE LOOP DE MIERDA
function findPatientById(id) {

    let patientList = getStoredPatients();
    let foundPatient = false;


    for (let i = 0; i < patientList.length; i++) {

        if (patientList[i].info.id === id) {

            foundPatient = patientList[i];

        } else { }
    }
    return foundPatient;
}

function findPatientIndexById(id) {
    let patientList = getStoredPatients();
    let index = false;

    for (let i = 0; i < patientList.length; i++) {
        if (patientList[i].info.id === id) {
            index = i;
        } else { }
    }

    return index;
}

function findBalanceInPatient(patient) {
    let balance = false;
    for (let i = 0; i < patient.controls.length; i++) {
        if (patient.controls[i].type === "balance") {
            balance = patient.controls[i];
        } else {

        }
    }

    return balance;
}

function findBalanceControlIndexInPatient(patient) {
    let found = false;
    for (let i = 0; i < patient.controls.length; i++) {
        if (patient.controls[i].type === "balance") {
            found = i;
        } else {

        }
    }

    return found;
}

function findHgtControlInPatient(patient) {
    let hgt = false;
    for (let i = 0; i < patient.controls.length; i++) {
        if (patient.controls[i].type === "hgt") {
            hgt = patient.controls[i];
        } else {

        }
    }

    return hgt;
}

function findHgtControlIndexInPatient(patient) {
    let found = false;
    for (let i = 0; i < patient.controls.length; i++) {
        if (patient.controls[i].type === "hgt") {
            found = i;
        } else {

        }
    }

    return found;
}

function createControlHemodinamico() {
    let newcontrol = {
        type: "hemodinamico",
        date: new Date().getTime(),
        ts: "",
        td: "",
        tam: () => {
            let one = 2 * +this.td;
            let two = +one + +this.ts;
            let three = +two / 3
            return three;
        }
    }

    return newcontrol;
}

function createControlBalance() {
    let newcontrol = {
        type: "balance",
        date: "",
        ivo: 0,
        iev: 0,
        cat: 0,
        peso: 0,
        diu: 0
    }

    return newcontrol;
}

function createControlHgt() {
    let newcontrol = {
        type: "hgt",
        date: new Date().getTime(),
        d: {
            hgt: 0,
            correccion: 0
        },
        a: {
            hgt: 0,
            correccion: 0
        },
        m: {
            hgt: 0,
            correccion: 0
        },
        c: {
            hgt: 0,
            correccion: 0
        }
    }

    return newcontrol;
}

function createPendiente() {
    let newpendiente = {
        alertTime: {
            hs: 00,
            min: 00
        },
        priority: "green",
        Alert: 5,
        title: "Pendiente"
    }

    return newpendiente;
}



$("body").on("click", ".hgtD", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor del HGT");
    console.log("newvalue ", newvalue);
    if (newvalue === null) {
        newvalue = 0;
    }


    console.log(foundhgtControl);
    foundhgtControl.d.hgt = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);

})

$("body").on("click", ".hgtA", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor del HGT");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.a.hgt = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);

})

$("body").on("click", ".hgtM", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor del HGT");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.m.hgt = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);

})

$("body").on("click", ".hgtC", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor del HGT");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.c.hgt = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);

})

$("body").on("click", ".correccionD", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor de la corrección");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.d.correccion = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);
    $(".correccionSum").text(+foundhgtControl.d.correccion + +foundhgtControl.a.correccion + +foundhgtControl.m.correccion + +foundhgtControl.c.correccion)

})

$("body").on("click", ".correccionA", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor de la corrección");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.a.correccion = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);
    $(".correccionSum").text(+foundhgtControl.d.correccion + +foundhgtControl.a.correccion + +foundhgtControl.m.correccion + +foundhgtControl.c.correccion)
})

$("body").on("click", ".correccionM", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor de la corrección");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.m.correccion = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);
    $(".correccionSum").text(+foundhgtControl.d.correccion + +foundhgtControl.a.correccion + +foundhgtControl.m.correccion + +foundhgtControl.c.correccion)
})

$("body").on("click", ".correccionC", function () {

    let id = $(this).attr("id");

    let patient = findPatientById(id);
    console.log(patient);

    let hgtindex = findHgtControlIndexInPatient(patient);

    let foundhgtControl = findHgtControlInPatient(patient);

    let newvalue = prompt("Introduzca el valor de la corrección");
    if (newvalue === null) {
        newvalue = 0;
    }

    console.log(foundhgtControl);
    foundhgtControl.c.correccion = newvalue;

    patient.controls[hgtindex] = foundhgtControl;
    updateStoredPatientById(id, patient);

    $(this).text(newvalue);
    $(".correccionSum").text(+foundhgtControl.d.correccion + +foundhgtControl.a.correccion + +foundhgtControl.m.correccion + +foundhgtControl.c.correccion)
})



function updateStoredPatientById(id, newpatient) {
    let patientList = getStoredPatients();
    let patientIndex = findPatientIndexById(id);

    patientList[patientIndex] = newpatient;

    localStorage.setItem("patients", JSON.stringify(patientList));
    console.log("Patient list updated!");
}


function calcTAM(ts, td) {
    let one = 2 * +td;
    let two = +one + +ts;
    let three = +two / 3
    return three;
}

$("body").on("click", ".change_bed", function () {

    let id = $(this).attr("id");

    let newbed = prompt("Ingrese nueva cama");
    let paciente = findPatientById(id);

    if (newbed === null) {

    } else {
        paciente.info.bed = newbed;
        console.log(paciente);
        updateStoredPatientById(id, paciente);
        $(this).text(newbed);
        $(this).attr("class", "text-dark my-auto mx-auto change_bed animateText1")
        setTimeout(() => {
            $(".change_bed").attr("class", "text-dark my-auto mx-auto change_bed")
        }, 200);
    }
})

$("body").on("click", ".delete_patient", function () {

    let id = $(this).attr("id");

    let delete_patient = confirm("Borrar paciente?")

    console.log(delete_patient);

    if (delete_patient === true) {

        removePatientById(id);
        $("#" + id).parent().remove();

    } else { }

})

function removePatientById(id) {
    let patientList = getStoredPatients();
    let index = false;

    for (let i = 0; i < patientList.length; i++) {
        if (patientList[i].info.id === id) {
            index = i;
        } else { }
    }

    if (index = false) {
        console.log("cannot find patient to delete")
    } else {
        console.log("delete patient");
        patientList.splice(index, 1);
        localStorage.setItem("patients", JSON.stringify(patientList));
    }
}

//toggle controles window
$("body").on("click", ".toggle-controles", function () {

    if ($(this).attr("class") === "my-auto toggle-controles show") {
        $(this).attr("class", "my-auto toggle-controles hidden");
        $(".controles_here").hide("fast");
    } else if ($(this).attr("class") === "my-auto toggle-controles hidden") {
        $(this).attr("class", "my-auto toggle-controles show");
        $(".controles_here").show("fast");
    }

})


$("body").on("click", ".add_pendiente", function () {

    let id = $(this).attr("id");
    let foundPatient = findPatientById(id);

    let newPendiente = createPendiente();
    foundPatient.pendientes.push(newPendiente);
    updateStoredPatientById(id, foundPatient);
    $(".pendientes_here").empty();
    renderPendientesFromPatientId(id);

})


$("body").on("click", ".pending_title", function () {

    let index = $(this).attr("id");
    let id = $(".pendientes_here").attr("id");
    let foundPatient = findPatientById(id);
    let title = prompt("Nombre del pendiente");
    console.log(title)

    if (title === null) {

    } else {
        foundPatient.pendientes[index].title = title
        $(this).text(title);
        updateStoredPatientById(id, foundPatient);
    }



})


$("body").on("click", ".hs_btn", function () {

    let index = $(this).attr("id");
    let id = $(".pendientes_here").attr("id");
    let foundPatient = findPatientById(id);
    let title = prompt("Hora");

    if (title === null) {

    } else {
        foundPatient.pendientes[index].alertTime.hs = title;
        updateStoredPatientById(id, foundPatient)
        $(this).text(title);
    }

})

$("body").on("click", ".min_btn", function () {

    let index = $(this).attr("id");
    let id = $(".pendientes_here").attr("id");
    let foundPatient = findPatientById(id);
    let title = prompt("Hora");
    let pendigTitle = $(".pendientes_here").find("#" + index + ".pending_title").text();

    console.log("pending title ", pendigTitle)

    if (title === null) {

    } else {
        foundPatient.pendientes[index].alertTime.min = title;
        updateStoredPatientById(id, foundPatient)
        $(this).text(title);

    }
})

function createPendienteAlarm(id, index, time, title) {

    let alarmObject = {
        alarmID: index + id,
        id: id,
        index: index,
        initTime: time,
        title: title
    }

    console.log("alarm created: ", alarmObject)
    pendienteAlarms.push(alarmObject);
}

