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

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}