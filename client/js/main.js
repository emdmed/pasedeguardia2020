let triagixweb = "www.google.com"

//request patient example onload
let PATIENT_EXAMPLE_; //never write data here
let patient_example; //write on this one only

//request list
requestPatientList();

//request patient list every 30s time
setInterval(() => {
    requestPatientList();
}, 30000);

function requestPatientExample(){
    $.ajax({
        url: "/patient_example",
        method: "GET",
        success: function(res){
            let data = res
            PATIENT_EXAMPLE_ = data;
            console.log(PATIENT_EXAMPLE_);
            console.log("Patient model retrieved");
            patient_example = PATIENT_EXAMPLE_;
        }
    })
}

$("body").on("click", "#send_patient_btn", function(){
    //validation pending
    console.log("click");

    let phone = $("#patient_phone").val();
    let age = $("#patient_age").val();
    let date = new Date();
    let nomobile = $("#nomobile_check").prop("checked");
    console.log(nomobile);

    patient_example.info.phone = phone;
    patient_example.info.age = age;
    patient_example.info.date = date;
    patient_example.info.nomobile = nomobile;

    render_clinic_triage()
})

$("body").on("click", ".getPatientList_btn", function(){

    //request list
    requestPatientList();

});

//just for testing
$("body").on("click", "#addTestPatient_btn", function(){

    $.ajax({
        url: "/score_patient",
        method: "GET",
        success: function(res){
            console.log("success")
        }
    })

});

function render_clinic_triage(){
    $("#clinic_triage_modal").find(".modal-body").empty();
    $("#clinic_triage_modal").find(".modal-body").append(`<h5 class="m-0 text-center">Por favor realice las siguientes preguntas.</h5><p>Si alguna es afirmativa por favor seleccionela, de lo contrario seleccione "Continuar"</p><hr>`)
    let symptoms = patient_example.ruleOut;

    for(key1 in symptoms){
        for(key2 in questions){
            if(key1 === key2){
                $("#clinic_triage_modal").find(".modal-body").append(`
    
                <button class="btn btn-outline-primary ruleout_btn" id="${key1}">${questions[key2]}</button>    
                <hr>
    
            `)
            }
        }
    }

    //re render continue button
    $("#clinic_triage_modal").find(".modal-footer").empty();
    $("#clinic_triage_modal").find(".modal-footer").append(`
    
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="end_patient_modal_btn">Continuar</button>

    `)
}

$("body").on("click", ".ruleout_btn", function(){
    let id = $(this).attr("id");

    patient_example.ruleOut[id] = true;


    console.log("Sending patient: ", patient_example);

    $.ajax({
        url: "/send_patient_to_server",
        method: "POST",
        contentType: "application/JSON",
        data: JSON.stringify(patient_example),
        success: function(res){

            if(res.message === "Duplicated phone in db"){
                alert("El numero de telefono indicado ya se encuentra en uso.");
            }

            //reset modal
            $("#clinic_triage_modal").find(".modal-body").empty();
            $("#clinic_triage_modal").find(".modal-body").append(`
            
                <p>Telefono</p>
                <input type="number" placeholder="Telefono celular" id="patient_phone">
                <hr>
                <p>Edad</p>
                <input type="number" placeholder="Edad" id="patient_age">

            `);

            $("#clinic_triage_modal").modal("hide");

            requestPatientList();
            //reset patient example
            requestPatientExample();
        }
    })
})

//reset add_patient modal when hidden
$('#clinic_triage_modal').on('hidden.bs.modal', function () {
    $("#clinic_triage_modal").find(".modal-body").empty();
    $("#clinic_triage_modal").find(".modal-body").append(`
    
        <p>Telefono</p>
        <input type="number" placeholder="Telefono celular" id="patient_phone" value="11">
        <hr>
        <p>Edad</p>
        <input type="number" placeholder="Edad" id="patient_age">

    `);

    $("#clinic_triage_modal").find(".modal-footer").empty();
    $("#clinic_triage_modal").find(".modal-footer").append(`
    
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="send_patient_btn">Continuar</button>

    `)
});

$("body").on("click", "#end_patient_modal_btn", function(){

    console.log("Seding patient: ", patient_example);

    $.ajax({
        url: "/send_patient_to_server",
        method: "POST",
        contentType: "application/JSON",
        data: JSON.stringify(patient_example),
        success: function(res){
                 

            if(res.message === "Duplicated phone in db"){
                alert("El numero de telefono indicado ya se encuentra en uso.");
            }

            $("#clinic_triage_modal").modal("hide");
            //render patient on ui 

            requestPatientList();
            requestPatientExample();

        },
        error: function(res){
            let problem = res;
            alert(problem.message);
        }
    })
})

function requestPatientList(){
    $.ajax({
        url: "/patient_list",
        method: "GET",
        success: function(res){
            let data = res
            let priority_class;
            let pendingTriageBadge = `<img src="./images/triagix/correct.png" height="20px" class="px-4">`;

            $("#patient_cards_here").empty();
            setWaitingPatientsNumber(data);
            countPatientTypes(data);


            //order data by data.score
            let orderedData = data.sort((a,b) =>  b.score > a.score ? 1:-1)
            console.log("ordered patient ", orderedData);

            orderedData.forEach(element => {

                console.log("score ", element.score, " patient ", element.age)

                //set waiting time
                let waitingTime;
                moment.locale('es');
                waitingTime = moment(element.info.date).startOf().fromNow(); 
          
                //set card color according priority score
                if(element.score >= 0 && element.score < 30){
                    priority_class = "border-left-success";
                    renderNewDashboardPatientCard(element, priority_class, pendingTriageBadge, waitingTime);
                } else if(element.score >= 30 && element.score < 60){
                    priority_class = "border-left-warning";
                    renderNewDashboardPatientCard(element, priority_class, pendingTriageBadge, waitingTime);
                } else if(element.score > 60){
                    priority_class = "border-left-danger";
                    renderNewDashboardPatientCard(element, priority_class, pendingTriageBadge, waitingTime);
                }
            });

            orderedData.forEach(element=>{
                //set waiting time
                let waitingTime;
                moment.locale('es');
                waitingTime = moment(element.info.date).startOf().fromNow(); 

                if(element.score === undefined){
                    priority_class = "border-left-dark"
                    pendingTriageBadge = `<img src="./images/triagix/timer.png" height="20px" class="px-4">`
                    renderNewDashboardPatientCard(element, priority_class, pendingTriageBadge, waitingTime);
                }
            })
        }
    })
}

function renderNewDashboardPatientCard(element, priority_class, pendingTriageBadge, waitingTime){
    let covidBadge;

    if(element.info.covidAlert === true){
        covidBadge = `<img src="./images/triagix/coronavirus.png" height="30px" class="mr-3">`
    } else {
        covidBadge = "";
    }

    $("#patient_cards_here").append(`
         
        <div class="card shadow-sm mb-2 ${priority_class}" id="${element.info.phone}">
    
            <div class="card-body p-2">

                <div class="row no-gutters align-items-center">

                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Nro ${element.info.number}</div>
                        <div class="h4 mb-0 font-weight-bold text-gray-800">${element.info.age} años</div>
                    </div>

                    <div class="col mr-2">
                        <div class="font-weight-bold mb-1">Esperando ${waitingTime}</div>
                    </div>

                    <div class="col-auto">
                    ${pendingTriageBadge}
                    ${covidBadge}
                    <a class="btn btn-primary" href="https://web.whatsapp.com/send?phone=${element.info.phone}&text=Hola%20porfavor%20complete%20el%20ingreso%20a%20la%20guardia%20con%20el%20siguiente%20link%20https://${triagixweb}/paciente" >Enviar triage</a>
                    <button class="btn btn-outline-primary delete_patient" id="${element.info.phone}">Atendido</button>
                    </div>

                </div>
        
            </div>
        </div>

    `)
}

function setWaitingPatientsNumber(data){
    $("#waitingPatientTitle").text(`${data.length} Pacientes en espera`);
}


$("body").on("click", ".delete_patient", function(){

    let check = confirm("¿Confirmar que el paciente ya fue atendido?")
    console.log(check)
    if(check === false){

    } else if (check === true){
        let phonenumber = $(this).attr("id");

        $.ajax({
            url: "/delete_patient",
            method: "POST",
            data: {phone: phonenumber},
            success: function(res){
                console.log(res);
                requestPatientList();
            }
        })
    }
})

function countPatientTypes(patientList){

    let patientTypes = {
        red: 0,
        yellow: 0,
        green: 0,
        black: 0,
        covid: 0
    }

    patientList.forEach(element=>{

        if(element.score >= 60){
            ++patientTypes.red + 1
        } else if (element.score >= 30 && element.score < 60){
            ++patientTypes.yellow + 1
        } else if (element.score >= 0 && element.score < 30){
            ++patientTypes.green
        } else if(!element.score){
            ++patientTypes.black 
        }else {}

        if (element.info.covidAlert === true){
            console.log("covid detected")
            ++patientTypes.covid
        }

    })

    $(".redPatientsAlert").text(patientTypes.red);
    $(".yellowPatientsAlert").text(patientTypes.yellow);
    $(".greenPatientsAlert").text(patientTypes.green);
    $(".blackPatientsAlert").text(patientTypes.black);
    $(".covidAlerts_n").text(patientTypes.covid);
}