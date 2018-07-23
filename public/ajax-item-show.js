"use strict";



// Buy button functionality
$('#buy-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("buy request sent!");
				alert("buy request sent!");
				
				$('#buy-form').addClass("hiddenForm");
				$('#buycancel-form').removeClass("hiddenForm");
				}else{
					console.log("could not send buy request! (response)");
				alert("could not send buy request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send buy request!");
				alert("could not send buy request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

// BuyCancel button functionality
$('#buycancel-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("buy request canceled!");
				alert("buy request canceled!");
				$('#buycancel-form').addClass("hiddenForm");
				$('#buy-form').removeClass("hiddenForm");
				}else{
					console.log("could not cancel buy request! (response)");
				alert("could not cancel buy request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send buy request!");
				alert("could not send buy request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

// approve buy button functionality
$('.approve-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("item request approved!");
				alert("buy request approved!");
				$("#requests-div").addClass("hiddenForm");
				$("#approved-div").removeClass("hiddenForm");
				}else{
					console.log("could not approve buy request! (response)");
				alert("could not approve buy request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send approve request!");
				alert("could not send approve request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

// Seller cancel buy approval button functionality
$('.cancelApproval-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("approval canceled!");
				alert("approval canceled!");
				$("#approved-div").addClass("hiddenForm");
				$("#requests-div").removeClass("hiddenForm");
				}else{
					console.log("could not send request! (response)");
				alert("could not send request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send request!");
				alert("could not send request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

// buyer cancel approval functionality
$('#buyerCancelApproval-form').on('submit', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("approval canceled!");
				alert("approval canceled!");
				$("#buyerCancelApproval-form").addClass("hiddenForm");
				$("#buycancel-form").removeClass("hiddenForm");
				}else{
					console.log("could not send request! (response)");
				alert("could not send request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send request!");
				alert("could not send request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

//drop off button
$('#dropOff-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("drop off approved!");
				alert("drop off approved!");
				$("#approved-div").addClass("hiddenForm");
				$("#dropOffCancel-div").removeClass("hiddenForm");
				}else{
					console.log("could not approve drop off request! (response)");
				alert("could not approve drop off request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send request!");
				alert("could not send request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

//cancel drop off button
$('#cancelDropOff-form').on('submit', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("drop off canceled!");
				alert("drop off canceled!");
				$("#dropOffCancel-div").addClass("hiddenForm");
				$("#approved-div").removeClass("hiddenForm");
				}else{
					console.log("could not send request! (response)");
				alert("could not send request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send request!");
				alert("could not send request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

//confirm received button
$('#received-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("Pickup approved!");
				alert("Pickup approved!");
				$("#buyerConfirm-div").addClass("hiddenForm");
				$('#resell-form').removeClass("hiddenForm");
				}else{
					console.log("could not approve Pickup request! (response)");
				alert("could not approve Pickup request!");
				}
			},
			error: function (data) {
				console.log("Error:could not send request!");
				alert("could not send request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

// RE-Sell button functionality
$('#resell-form').on('click', function(e) {
	e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
	    console.log("horray!");
		var actionUrl = $(this).attr('action');
		console.log(actionUrl);
		$.ajax({
			url: actionUrl,
			type: 'GET',
			success: function success(data) {
				if (data){
				console.log("item is now offered for sale!");
				alert("item is now offered for sale!");
				$('#resell-form').addClass("hiddenForm");
				}else{
					console.log("could not sell! (response)");
				alert("could not sell!");
				}
			},
			error: function (data) {
				console.log("Error:could not send sell request!");
				alert("could not send sell request!");
			}
		});
	} else {
		$(this).find('button').blur();
	}
});