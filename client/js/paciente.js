//too add symptoms
//1 - Update patientModel on server
//2 - Update clinicTriageQuestions on frontend
//3 - Update class and object change on frontend

let PATIENT_EXAMPLE;
let patient_example;

let abdominalClicks = {
    abdomen: false,
    evolution: false
}

//monitor abdominal clicks
function monitorAbdominalClicks(){
    if(abdominalClicks.abdomen === true && abdominalClicks.evolution === true){
        $("#end_symptom_detail").prop("disabled", false);
    }
}

console.log("paciente iniciado")

function initPatient(){
    $.ajax({
        url: "/patient_example",
        method: "GET",
        success: function(res){
            let data = res
            PATIENT_EXAMPLE = data;
            console.log("Patient example retrieved");
        }
    })
}

function renderSymptomsFrontend(){

    $("#symptoms_here").empty();
    //render frontend
    let symptoms = PATIENT_EXAMPLE.symptoms;

    $("#symptoms_here").append(`
        
        <h2>¿Cómo te sientes?</h2>  
        <hr>

    `)

    for(key1 in symptoms){
        for(key2 in spanishSymptoms){
            if(key1 === key2){

                let modalLauncher;

                //put symptoms with detais here
                if(key1 === "abdominalPain"){
                    modalLauncher = `data-toggle="modal" data-target="#symptom_details_modal"`
                }

                $("#symptoms_here").append(`
    
                <button class="btn btn-outline-primary" ${modalLauncher} id="${key1}">${spanishSymptoms[key2]}</button>    
                <hr>
    
            `)
            }
        }
    }

    $("#symptoms_here").append(`
        <button class="btn btn-block btn-primary" id="end_symptoms">Finalizar</button>
    `)
}

$("body").on("click", "#init_sintomas", function(){

    patient_example = PATIENT_EXAMPLE;

    let phone = $("#phoneNumber").val();

    patient_example.info.phone = parseInt(phone);

    //send phone to db and check if it exists
    $.ajax({
        url: "/check_phone",
        method: "POST",
        data: {phone: patient_example.info.phone},
        success: function(res){
            console.log(res);
            patient_example = res;

            console.log("Received patient ", patient_example.info)
            //if succes render symptoms ui
            renderSymptomsFrontend();
        },
        error: function(res){
            alert("El telefono solicitado no se encuentra registrado en la guardia.")
        }
    })


});

//SYMPTOMS BUTTONS
$("body").on("click", "#fever", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.fever.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.fever.isPresent = false;
    }
})

$("body").on("click", "#cough", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.cough.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.cough.isPresent = false;
    }
})

$("body").on("click", "#abdominalPain", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.abdominalPain.isPresent = true;

        let buttonHeight = "18.5vh"

        // launch symptoms details
        //()modal body is already empty)
        //append html
        let detailButtonsWidth = "80px"
        $("#symptom_details_modal").find(".modal-title").text("Indique la zona donde le duela más")
        $("#symptom_details_modal").find(".modal-body").append(`

            <div class="container-fluid text-center mx-auto ">
            <img src="./images/triagix/abdomen4.png" class="abdomen-image mx-auto">

                <div class="row text-center mx-auto" style="height: ${buttonHeight}">
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="one">uno</button>
                    </div>
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen " id="two">dos</button>
                    </div>    
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="three">tres</button>
                    </div>
                </div>

                <div class="row text-center mx-auto" style="height: ${buttonHeight}">
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="four">cuatro</button>
                    </div>
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="five">cinco</button>
                    </div>    
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="six">seis</button>
                    </div>
                </div>

                <div class="row text-center mx-auto" style="height: ${buttonHeight}">
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="seven">siete</button>
                    </div>
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="eight">ocho</button>
                    </div>    
                    <div class="col text-center mx-auto p-0">
                        <button class="btn btn-outline-primary transparent btn-block mx-auto full-size-button abdomen" id="nine">nueve</button>
                    </div>
                </div>
                <hr>
                <p>¿Hace cuántos días?</p>
                <button class="btn btn-sm btn-outline-primary abd_evolution" id="1">1 día o menos</button>
                <button class="btn btn-sm btn-outline-primary abd_evolution" id="3">de 2 a 3 días</button>
                <button class="btn btn-sm btn-outline-primary abd_evolution" id="4">mas de 3 días</button>
            </div>
        `)


    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.abdominalPain.isPresent = false;
    }
})

//click on abdomen event
$("body").on("click", ".abdomen", function(){
    let id = $(this).attr("id");
    console.log(id);

    for(key in patient_example.symptoms.abdominalPain.location){
        if(key === id){
            console.log(key);
            patient_example.symptoms.abdominalPain.location[key] = true;
        }
    }

    abdominalClicks.abdomen = true;
    monitorAbdominalClicks();
})

$("body").on("click", ".abd_evolution", function(){
    let id = parseInt($(this).attr("id"));
    
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary abd_evolution"){
        $(".abd_evolution").attr("class", "btn btn-outline-primary abd_evolution")
        $(this).attr("class", "btn btn-primary-sm abd_evolution")
    } else if(thisClass === "btn btn-primary-sm abd_evolution" ){
        $(".abd_evolution").attr("class", "btn btn-outline-primary abd_evolution")
        $(this).attr("class", "btn btn-outline-primary abd_evolution")
    }

    if(id === 1){
        patient_example.symptoms.abdominalPain.durationInDays = 1;
    }else if (id === 3){
        patient_example.symptoms.abdominalPain.durationInDays = 3;
    }else if (id === 4){
        patient_example.symptoms.abdominalPain.durationInDays = 4;
    }

    abdominalClicks.evolution = true;
    monitorAbdominalClicks();
})

$("body").on("click", "#throatPain", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.throatPain.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.throatPain.isPresent = false;
    }
})

$("body").on("click", "#runnyNose", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.runnyNose.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.runnyNose.isPresent = false;
    }
})

$("body").on("click", "#urinatingPain", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.urinatingPain.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.urinatingPain.isPresent = false;
    }
})

$("body").on("click", "#diarrhea", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.diarrhea.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.diarrhea.isPresent = false;
    }
})

$("body").on("click", "#vomiting", function(){
    let thisClass = $(this).attr("class");
    if(thisClass === "btn btn-outline-primary"){
        $(this).attr("class", "btn btn-primary");
        patient_example.symptoms.vomiting.isPresent = true;
    }else if(thisClass === "btn btn-primary"){
        $(this).attr("class", "btn btn-outline-primary");
        patient_example.symptoms.vomiting.isPresent = false;
    }
})



//close detail modal
$("body").on("click", "#end_symptom_detail", function(){
    //reset modal
    $("#symptom_details_modal").find("modal-body").empty();
    $("#symptom_details_modal").modal("hide");

    //send updated patient
    /*
    $.ajax({
        url: "/update_patient_in_db",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(patient_example),
        success: function(res){
            alert("Patient updated in db");
        }
    })*/
})

//finish loop
$("body").on("click", "#end_symptoms", function(){

    //send paciente to backend
    $.ajax({
        url: "/update_patient_in_db",
        method: "POST",
        contentType: "application/JSON",
        data: JSON.stringify(patient_example),
        success: function(res){
            let patient = res;
            console.log(patient);
            $("#symptoms_here").empty()

            //render patient number

            $("#symptoms_here").append(`
                <h2>Por favor espere a ser atendido</h2>
                <h3>Su número de identificacion es:</h3>
                <h1 class="text-center">${patient.number}</h1>
            `)
            
        }
    })
})