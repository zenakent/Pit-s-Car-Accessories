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
        
        
        
