function ValidateName(name)
{
    if (/^[a-zA-Z ]+$/.test(name)){
        return(true)
    }
    alert("Error, por favor verifica los datos ingresados")
}

$("body").on("click", "#login", function(){

    let user = $("#user").val();
    let password = $("#password").val();

    let validatedUser = ValidateName(user);
    let validatedPassword = ValidateName(password)

    if(validatedUser === true && validatedPassword && true){
        $.ajax({
            url: "/login",
            method: "POST",
            data: {user, password},
            success: function(res){
                let data = res;

                window.location= data.url;
            },
            error: function(error){
                alert("Credenciales no válidas")
            }
        })
    }

})