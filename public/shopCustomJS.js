$(document).ready(function() {
    $('#cashOnDelivery').click(function() {
        if($('#cashOnDelivery').is(':checked')) { 
            $("#paymentMethodNote").text("Item's are delivered through LBC. We will contact you when your order has been shipped."); 
        }
    });
    
    $('#remittance').click(function() {
        if($('#remittance').is(':checked')) { 
            $("#paymentMethodNote").text("Please select a service");
            $("#paymentMethodNote").append('<div id="selectRemit" style="margin-top: 1em;"></div>');
            $("#selectRemit").append('<input type="radio" name="remitMethod" id="remit1" value="Palawan Pera Padala"><img style="margin-left: 10px;" src="../../../assets/pages/img/photos/palawan.PNG" width="auto" height="50">')
            $("#selectRemit").append('<input type="radio" name="remitMethod" id="remit2" value="Cebuana Pera Padala" style="margin-left: 15px;"><img style="margin-left: 10px;" src="../../../assets/pages/img/photos/cebuana.jpg" width="auto" height="50">')
        }
    });
})


function test(id) {
  var radio = document.getElementById(id);
  
  var x = radio.value
  
  
  console.log(x);
  // console.log(typeof radio.value); //it's a string! change it into an object!
  
  var jsonStr = radio.value.replace(/(\w+:)|(\w+ :)/g, function(matchedStr, value, string) {
    return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
  });
  console.log(jsonStr)
  var shippidingAddress = JSON.parse(jsonStr);
  
 
  
  console.log(shippidingAddress);
  
  
  document.getElementById('fullName').innerHTML = shippidingAddress.fullName;
  document.getElementById('address').innerHTML = shippidingAddress.address;
  document.getElementById('contactNumber').innerHTML = shippidingAddress.contactNumber;
}



function showModal(id)
{
  var modal = document.getElementById(id);
  // console.log(modal);
  modal.style.display = "block";
  
  var span = document.getElementsByClassName("close")[0];
  var no = document.getElementsByClassName("noClose")[0];
  var addressClose = document.getElementsByClassName("addressClose")[0];
  var chooseAddress = document.getElementsByClassName("chooseAddressClose")[0];
  
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  
  span.onclick = function() {
    modal.style.display = "none";
  }
 
}


// $(document).ready(function() {
//   $.getJSON("/cart/api")
//   .then(function(data) {
//     console.log(data);
//   });
// });
                            
$(document).ready(function() {
  $.getJSON("/cart/api")
  .then(addItems)
  .then(showTotalQty);
  // .then(function(data) {
  //   console.log(data.cart.items);
  // });
  
  // $('.addItemToCart').click(function() {
    
  //   var id = $(this).attr('id');
  //   console.log("/add-to-cart/" + id)
    
  //   $.post('api/todos', {name: "maui"})
  //   .then(function(test){
  //     console.log(test);
  //   })
  // })
  
});

function addItems(items) {
  //add items to cart here
  // console.log(items)
  var arr = [];
  for ( var id in items.cart.items) {
    arr.push(items.cart.items[id]);
  }
  console.log(arr)
  // console.log(arr);
  arr.forEach(function(item) {
    // console.log(item.item._id);
    var newItem = $('<li><a href="/shop-item/' +item.item._id + '"><img src="' + item.item.image + '" width="37" height="34"></a><span class="cart-content-count">x ' + item.qty + '</span><strong><a href="/shop-item/' + item.item._id+ '">' + item.item.name + '</a></strong><em>₱' + item.item.price + '</em><a href="/cart/remove/' + item.item._id + '" class="del-goods">&nbsp;</a></li>')
    // console.log(newItem)
    $('.scroller').append(newItem);
  });
  
  console.log(items.cart.totalQty);
  $('#totalQty').text(items.cart.totalQty)
  $('#totalPrice').text(items.cart.totalPrice)
}

function showTotalQty(item) {
  console.log(item)
}