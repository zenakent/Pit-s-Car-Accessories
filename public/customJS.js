function showModal(id)
{
  var modal = document.getElementById(id);

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




$(document).ready(function() {

$.getJSON('https://ron-swanson-quotes.herokuapp.com/v2/quotes', function(data) {
    console.log(data[0])
  $("#quote").text(data[0])
})

$.getJSON('https://complimentr.com/api ', function(data) {
    console.log(data.compliment)
  $("#compliment").text(data.compliment)
})
})



var pusher = new Pusher('db76396892f7f71a4340', { cluster: 'ap1' });

// retrieve the socket ID once we're connected
pusher.connection.bind('connected', function () {
    // attach the socket ID to all outgoing Axios requests
    axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
});

// request permission to display notifications, if we don't alreay have it

pusher.subscribe('notifications')
        .bind('post_updated', function (notification) {
            notifCount += 1;
            orderscounts += 1;
             $('.notifcount').text(notifCount);
             $('.orderCount').text(orderscounts);
             $('#notifList').append('<a href="/admin/notifications/' +notification._id + '" class="dropdown-item message d-flex align-items-center"><div class="content"><strong class="d-block">'+notification.name+'</strong><span class="d-block">Ordered Something</span></div></a>  ')
        });
        
        
        
