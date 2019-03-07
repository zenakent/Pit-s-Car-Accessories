$(document).ready(function() {
    $('#cashOnDelivery').click(function() {
        if($('#cashOnDelivery').is(':checked')) { 
            $("#paymentMethodNote").text("Item's are delivered through LBC. We will contact you when your order has been shipped."); 
        }
    });
    
    $('#remittance').click(function() {
        if($('#remittance').is(':checked')) { 
            $("#paymentMethodNote").text("We'll get in contact with you to assist on how to pay for the remittance"); 
        }
    });
})



function showModal(id)
{
  var modal = document.getElementById(id);
  console.log(id);
  modal.style.display = "block";
  
  var span = document.getElementsByClassName("close")[0];
  
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
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