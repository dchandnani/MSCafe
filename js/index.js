var total = 0;
var menu = [
	{ name: "Cashew Chicken", amt: 7, img: "images/chinese.jpg"},
	{ name: "Sushi", amt: 8, img: "images/sushi.jpg"},
	{ name: "Steak", amt: 9, img: "images/steak.jpg"},
	{ name: "Pizza", amt: 5, img: "images/pizza.jpg"},
	{ name: "Fruits", amt: 6, img: "images/fruits.jpg"},
	{ name: "Thai Curry", amt: 8, img: "images/thai.jpg"}
];


Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var cart = new Array();

//window.alert = navigator.notification.alert;


// Wait for Cordova to connect with the device
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
function onDeviceReady() {
}

function foodSelectionChanged(e) {
	var amt = getAmount(e.name)
	total = e.checked ? (total+amt) : (total-amt);
	e.checked ? cart.push(e.name) : cart.remove(cart.indexOf(e.name));
	$("#orderTotalTb").text("$" + total + ".00");
}

function getAmount(name) {
	for(var i=0;i<menu.length;i++)
		if(menu[i].name==name)
			return menu[i].amt;
}

function getmenuItem(name) {
	for(var i=0;i<menu.length;i++)
		if(menu[i].name==name)
			return menu[i];
}

function showOrder() {
	if(menu==null || menu.length<=0)
	{
		$("#statusTb").text("No item selected");
		return;
	}

	for(var i=0;i<cart.length;i++) {
		var m = getmenuItem(cart[i]);
		var s = getItemRow(m.name, m.img, m.amt);
		var h = $("#orderList").html();
		$("#orderList").html(h+s);
	}
	$("#statusTb").text("Your order is being prepared...");
	setTimeout(showNotification, 5000);
}

function getItemRow(name, img, amt) {
	var s ='<div data-dojo-type="dojox/mobile/ListItem" style="height:85px;line-height: 20px;">' +
			 '<img src="' + img + '" alt="" style="width:80px;height:80px;float:left;"/>'+
	   		 '<div style="padding-left: 85px;vertical-align:middle;padding-top:20px">' +
				 '<div style="font-size:0.9em;margin-left:20px;margin-bottom:5px">' + name + '</div>' +
				 '<div style="font-size:0.7em;margin-left:20px">$' + amt + '.00</div>' +
			 '</div>' +
    		'</div>';
    return s;
}

// alert dialog dismissed
function alertDismissed() {
    // do something
}

// Show a custom alert
function showNotification() {
	$("#statusTb").text("Your order is ready for pickup!");
    navigator.notification.alert(
        'Your meal is now ready for pickup!',  // message
		alertDismissed,			// callback
        'Geek Cafe',            // title
        'Done'                  // buttonName
    );
	playBeep();
	vibrate();
}

// Beep three times
function playBeep() {
    navigator.notification.beep(3);
}

// Vibrate for 2 seconds
function vibrate() {
    navigator.notification.vibrate(2000);
}


function showDirections() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

// onSuccess Geolocation
function onSuccess1(position) {
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + position.timestamp			           + '<br />';
}

// onError Callback receives a PositionError object
function onError(error) {
    navigator.notification.alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

var map = null;


function onSuccess(position) {
	// lat: 47.64545088168208
	// Long: -122.13027881839724
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map  = new google.maps.Map(document.getElementById('geolocation'), {
	mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: myLocation,
		zoom: 15
    });

	// Put marker on current location
    var marker = new google.maps.Marker({
		map: map,
		position: myLocation,
		title:'My location'
    });

	//var request = { location: myLocation, radius: '500', types: ['store'] };
	var request = { location: myLocation, radius: '500', query: 'Microsoft Building 41' };

	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}


function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		title: place.name
    });

	infowindow  = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < 1 /*results.length*/; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}




















