let STOREDPATIENTS = [];


function checkAndLoadExistingPatients(){
    let storage = localStorage.getItem("patients");
    if(!storage){
        //agregar el primer paciente?
    }else{
        //render localstorage
    }
}

$("body").on("click", "#create_patient_btn", function(){


    let name = $("#patient_name").val();
    let age = $("#patient_age").val();
    let bed = $("#patient_bed").val();
    let newPatient = createPatientModel(name, age, bed);
    //validate name ONLY 3 LETTERS
    if(name.length > 3){
        alert("La identificación del paciente sólo puede tener hasta 3 letras")
    } else {
        newPatient.info.name = name;
        newPatient.info.age = age;
        newPatient.info.bed = bed;
        newPatient.info.id = name+bed+age

        //push to soterdpatients array and save to localstorage
        STOREDPATIENTS.push(newPatient);
        console.log(STOREDPATIENTS);
        localStorage.setItem("patients", JSON.stringify(STOREDPATIENTS));
    }
})

$("body").on("click", "#see_patients_btn", function(){

    let patientList = getStoredPatients();
    $(".small_patient_container_onsidebar").empty();

    if($(this).attr("class") === "nav-link collapsed" || $(this).attr("class") === "nav-link"  ){
        patientList.forEach(element=>{
            $(".small_patient_container_onsidebar").append(`
                <a class="collapse-item active display_patient_button" data-toggle="collapse" data-target="#collapseTwo" id="${element.info.id}">${element.info.bed} ${element.info.name}</a>
            `)
        })
    }

})

function getStoredPatients(){
    let stored = JSON.parse(localStorage.getItem("patients"))
    return stored;
}

function createPatientModel(name, age, bed){
    let newpatient  = {
        info: {
            bed: bed,
            age: age,
            name: name,
            id: name+bed+age
        },
        atc: [],
        mi: "",
        controls: []
    }

    return newpatient;
}

$("body").on("click", ".display_patient_button", function(){

    let id = $(this).attr("id");
    console.log(id);

    let patientList = getStoredPatients();

    let found = false;

    patientList.forEach(element=>{
        if(element.info.id === id){
            found = element;
        } else {
        }
    })

    console.log(found);

    if(found === false){

    } else {
        $("#patient_cards_here").empty();
        renderPatientCard(found);

        $("#collapseTwo").collapse();
    }

})

function renderPatientCard(patient){
    $("#patient_cards_here").append(`
    
        <div class="container-fluid">
            <div class="row">
                <h4 class="mr-4 text-dark">${patient.info.name}</h4>
                <h3 class="ml-4 text-dark">${patient.info.bed}</h3>
                <h3 class="ml-4 text-dark">${patient.info.age}</h3>
            </div>
            <hr>
            
            <div class="row">
                <div class="card w-100">
                    <div class="card-body">
                        <h5>Motivo de internación</h5>
                        <p>${patient.mi}</p>
                    </div>
                </div>
            </div>

            <div class="row mt-2">
                <div class="card w-100">
                    <div class="card-body">
                        <h5>Antecedentes</h5>
                        <div id="${patient.info.id}" class="antecedentes_here"></div>
                    </div>
                </div>
            </div>

            <div class="row mt-2">
                <div class="card w-100">
                    <div class="card-body">
                        <h5>Controles</h5>
                        <div id="${patient.info.id}" class="controles_here"></div>
                    </div>
                </div>
            </div>

 
          
  
        </div>

    `)
}