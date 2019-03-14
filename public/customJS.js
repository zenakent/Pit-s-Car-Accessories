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
        $("#quote").text(data[0]);
    });

    $.getJSON('https://complimentr.com/api ', function(data) {
        $("#compliment").text(data.compliment)
    });

    $.getJSON("/admin/product/api")
    .then(bestSelling);
  
    $.getJSON("/admin/product/api")
    .then(ranking);
});

function bestSelling(items) {
  var bestSellingItem = items[0];
  
  items.forEach(function(item) {
      if (bestSellingItem.totalSold < item.totalSold) {
          bestSellingItem = item;
      }
  })
  
  var item = $('<img class="card-img-top" src="'+ bestSellingItem.image +'" alt="'+ bestSellingItem.name + '"><div class="card-body"><h5 class="card-title">' + bestSellingItem.name + '</h5><p class="card-text"> Total Sold: <span style="color: #DB6574; ">'+ bestSellingItem.totalSold+'</span></p></div>')

  $('#best-selling').append(item);
}

function ranking(items) {
    
    
    var arr = items.sort(function(a,b) { return b.totalSold - a.totalSold; });
    var ranking = [];
    
    for (var x = 0; x <= 4; x++) {
        ranking.push(arr[x]);
    }
    
    ranking.forEach(function(item, index) {
        // var itemRank = $('<tr><td>'+ (index+1) +'</td><td><img src="'+ item.image+'" height="45" width="45"></td><td>'+ item.name+'</td><td>'+ item.totalSold+'</td></tr>')
        var itemRank = $(`<tr><td>${index+1}</td><td><img src="${item.image}" height="45" width="45"></td><td>${item.name}</td><td>${item.totalSold}</td></tr>`)
        $('.ranking').append(itemRank);
    })
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
             $('#notifList').append('<a href="/admin/notifications/' +notification._id + '" class="dropdown-item message d-flex align-items-center"><div class="content"><img src="' + notification.prodImage + '" height="45" width="45" style="display: inline"><strong style="display: inline">'+ notification.prodName +'</strong><span class="d-block">is running low. Only '+ notification.prodQuantity +' are left</span><span>Click here to add more</span> </div></a>  ')
        });
        
        
        
