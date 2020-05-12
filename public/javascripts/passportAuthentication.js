$("#pass-2").on('change', () => {
    $('#pass-2-error').text("");
    if($('#pass-1').val() !== $('#pass-2').val()){   
        $('#pass-2-error').text("Password not equals");
    }
})

$("#container").on('change', ()=>{
    if(
        $('#pass-1').val() !== '' && 
        $('#pass-1').val() === $('#pass-2').val() && 
        $('#name').val() !== '' && 
        $('#email').val() !== ''
    ){
        $('#btn-create-user').removeClass("btn-primary-disabled").addClass("btn-primary")
    }
})