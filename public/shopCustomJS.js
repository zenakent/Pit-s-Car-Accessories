$(document).ready(function() {
    $('#cashOnDelivery').click(function() {
        if($('#cashOnDelivery').is(':checked')) { 
            $("#paymentMethodNote").text("Item's are delivered through LBC"); 
        }
    });
    
    $('#remittance').click(function() {
        if($('#remittance').is(':checked')) { 
            $("#paymentMethodNote").text("We'll get in contact with you to assist on where to pay for the remittance"); 
        }
    });
})