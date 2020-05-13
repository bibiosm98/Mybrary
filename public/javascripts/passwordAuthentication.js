$("#pass-1").on('change', () => {
    check()
})
$("#pass-2").on('change', () => {
    check()
})
function check(){
    $('#pass-2-error').text("");
    if($('#pass-1').val() !== $('#pass-2').val()){   
        $('#pass-2-error').text("Passwords not equals");
    }
}

$("#email-error").on('change', () => {
    $('#email-error').text("");
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