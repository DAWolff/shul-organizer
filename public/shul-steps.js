"use strict";

var shul_document = {
	schemaType: "shul",
	adminEmail: "",
	name: "",
	called: "",
	public: false,
	address: {
		street: "",
		city: "",
		state: "",
		zip: ""
	},
	rabbi: "",
	asstRabbi: "",
	chazan: "",
	board: [{
		title: "",
		person: ""
	}],
	shabbos: {
		minchaErevShabbos: "",
		kabolasShabbos: "",
		shacharis: "",
		mincha: "",
		maariv: ""
	},
	weekday: {
		shacharis1: "",
		shacharis2: "",
		shacharis3: "",
		mincha: "",
		maariv1: "",
		maariv2: ""
	},
	sundayLegalHoliday: {
		shacharis1: "",
		shacharis2: "",
		shacharis3: ""
	},
	events: [{
		label: "",
		date: "",
		desc: ""
	}],
	notes: ""
};

var storage_data = {
  "user_email": "",
  "access_level": "0",
  "logged_in": true,
  "user_id": "",
  "shul_id": "",
  "shul_name": "",
  "member_id": "",
  "services_id": "",
	"action": "update",
	"target": "shul"
};

var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale;             //fieldset properties which we will animate
var animating;                        //flag to prevent quick multi-click glitches


$(".next").click (function() {

	if (requiredFieldsValid()) {
	} else {
		return;
	};

	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        "transform": "scale('+scale+')",
        "position": "absolute"
      });
			next_fs.css({"left": left, "opacity": opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
	});
});


$(".previous").click (function() {
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({"left": left});
			previous_fs.css({"transform": "scale('+scale+')", "opacity": opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
	});
});


$("#add-official").click (function() {

		event.preventDefault();
		let count = $("#officials div").length;  // officials already on the Page
		let offtitle = "#offtitle0";
		let offpersn = "#offpersn0";
		if ( count > 0 ) {
			offtitle = "#offtitle" + (count -1);
			offpersn = "#offpersn" + (count -1);
		};
		let titleval = $(offtitle).val();
		let persnval = $(offpersn).val();
		// if there already a blank input for officials on the page, don't do the add...
		if ( titleval ||  persnval ) {
		} else {
			return
		};
		offtitle = "offtitle" + count;
		offpersn = "offpersn" + count;
		$("#officials").append( `
		 <div class="onerow">
			 <input type="text" id="${offtitle}" placeholder="Title" />
			 <input type="text" id="${offpersn}" placeholder="Person" />
		 </div>
		`);
})


function requiredFieldsValid() {

	let email = $("input[name='admin']").val().trim();

	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		if ( ! $("#js-error-alert").hasClass("hide") ) {
			$("#js-error-alert").addClass("hide");
		}
	} else {
		$("#js-error-txt").text("Email invalid or missing.  Please correct");
		$("#js-error-alert").removeClass("hide");
		watchCloseError();
		return false;
	};

	let name = $("input[name='name']").val().trim();
	let called = $("input[name='called']").val().trim();
	if (!(name.length > 2) || !called) {
		$("#js-error-txt").text("Shul Name & Nickname are required!");
		$("#js-error-alert").removeClass("hide");
		watchCloseError();
		return false;
	}
	return true;
}


function watchCloseError() {

  $("#js-error-alert").click(event => {
    event.preventDefault();
    $("#js-error-alert").addClass("hide");
  });
}


$("#add-event").click (function() {

		event.preventDefault();
		let count = $("#events div").length;    // events already on the Page
		let evlabl = "#evlabl0";
		let evdesc = "#evdesc0";
		let evdate = "#evdate0";
		if ( count > 0 ) {
			evlabl = "#evlabl" + (count -1);
			evdesc = "#evdesc" + (count -1);
			evdate = "#evdate" + (count -1);
		};
		let lablval = $(evlabl).val();
		let descval = $(evdesc).val();
		let dateval = $(evdate).val();
		// if there already a blank input for events on the page, don't do the add...
		if ( lablval ||  descval || dateval ) {
		} else {
			return
		};
		evlabl = "evlabl" + count;
		evdesc = "evdesc" + count;
		evdate = "evdate" + count;
		$("#events").append ( `
			<div class="onerow">
				<textarea class="label" id="${evlabl}" placeholder="Event Name"></textarea>
				<textarea class="desc" id="${evdesc}" placeholder="Event Description"></textarea>
				<textarea class="date" id="${evdate}" placeholder="Event When"></textarea>
			</div>
			`);
})


function watchUpdateSubmit() {

	$(".submit").click (function(event) {
		event.preventDefault();

		shul_document.adminEmail = $("input[name='admin']").val().trim();
		shul_document.name = $("input[name='name']").val().trim();
		shul_document.called = $("input[name='called']").val().trim();
		let pub = $("input[name='public']").val().trim();
		if (pub = "Public") {
			shul_document.public = true;
		} else {
			shul_document.public = false;
		}

		shul_document.address.street = $("input[name='street']").val().trim();
		shul_document.address.city = $("input[name='city']").val().trim();
		shul_document.address.state = $("input[name='state']").val().trim();
		shul_document.address.zip = $("input[name='zip']").val().trim();
		shul_document.rabbi = $("input[name='rabbi']").val().trim();
		shul_document.asstRabbi = $("input[name='asstrabbi']").val().trim();
		shul_document.chazan = $("input[name='chazan']").val().trim();

		let count = $("#officials div").length;
		let boardObj = '{"board": [';
		if (count > 0) {
			let title = "";
			let person = "";
			let titleId = "";
			let persnId = "";
			let boardStr = '{"board": [';
			for (var i = 0; i < count; i++) {
				let titleId = "#offtitle" + i;
				let persnId = "#offpersn" + i;
				title = $(titleId).val().trim();
				person = $(persnId).val().trim();
				boardStr = boardStr + '{"title":' + '"' + title + '"'
														+ ',"person":' +  '"' + person + '"'  + '}';
				if (i+1 === count) {    // if it's the last item, no comma at end
				} else {
					boardStr = boardStr + ",";
				};
			};  // for
			boardStr = boardStr + "] }";
			let boardObj = JSON.parse(boardStr);
		  let merge = Object.assign(shul_document, boardObj);
		  shul_document = merge;
		};

		shul_document.shabbos.minchaErevShabbos = $("input[name='minchafri']").val().trim();
		shul_document.shabbos.kabolasShabbos = $("input[name='kabolo']").val().trim();
		shul_document.shabbos.shacharis = $("input[name='shshacharis']").val().trim();
		shul_document.shabbos.mincha = $("input[name='shmincha']").val().trim();
		shul_document.shabbos.maariv = $("input[name='shmaariv']").val().trim();

		shul_document.weekday.shacharis1 = $("input[name='wkshach1']").val().trim();
		shul_document.weekday.shacharis2 = $("input[name='wkshach2']").val().trim();
		shul_document.weekday.shacharis3 = $("input[name='wkshach3']").val().trim();
		shul_document.weekday.mincha = $("input[name='wkmincha']").val().trim();
		shul_document.weekday.maariv1 = $("input[name='wkmaariv1']").val().trim();
		shul_document.weekday.maariv2 = $("input[name='wkmaariv2']").val().trim();
		shul_document.sundayLegalHoliday.shacharis1 = $("input[name='sushach1']").val().trim();
		shul_document.sundayLegalHoliday.shacharis2 = $("input[name='sushach2']").val().trim();
		shul_document.sundayLegalHoliday.shacharis3 = $("input[name='sushach3']").val().trim();

		count = $("#events div").length;
		if (count > 0) {
			let label = "";
			let desc = "";
			let dat = "";
			let eventStr = '{"events": [';
			for (var i = 0; i < count; i++) {
				let evlabl = "#evlabl" + i;
				let evdesc = "#evdesc" + i;
				let evdate = "#evdate" + i;
				label = $(evlabl).val().trim();
				desc = $(evdesc).val().trim();
				dat = $(evdate).val().trim();
				eventStr = eventStr + ' {"label":' + '"' + label + '"'
														+ ',"desc":'   + '"' + desc  + '"'
														+ ',"date":'   + '"' + dat   + '"'  + '}';
				if (i+1 === count) {    // if it's the last item, no comma at end
				} else {
					eventStr = eventStr + ",";
				};
			}; // for
			eventStr = eventStr + "] }";
			let eventObj = JSON.parse(eventStr);
			let merge = Object.assign(shul_document, eventObj);
			shul_document = merge;
		};   // count > 0

		shul_document.notes = $("#notes").val().trim();

		updateShulDocument(storage_data.shul_id);

	})
}


function displayShulData(data) {

	 $("input[name='admin']").val(data.adminEmail);
	 $("input[name='name']").val(data.name);
	 $("input[name='called']").val(data.called);
	 $("input[name='street']").val(data.address.street);
	 $("input[name='city']").val(data.address.city);
	 $("input[name='state']").val(data.address.state);
	 $("input[name='zip']").val(data.address.zip);
	 $("input[name='rabbi']").val(data.rabbi);
	 $("input[name='asstrabbi']").val(data.asstRabbi);
	 $("input[name='chazan']").val(data.chazan);

	 if (data.public) {
	 	 $("input[name='public']").val("Public");
		 }
	 else {
		 $("input[name='public']").val("Not Public");
	 };

 	 if (data.board.length > 0) {
		 for (var j in data.board) {
			 let title = data.board[j].title;
			 let person = data.board[j].person;
			 let offtitle = "offtitle" + j;
			 let offpersn = "offpersn" + j;
			 $("#officials").append( `
				<div class="onerow">
	        <input type="text" id="${offtitle}" placeholder="Title" value="${title}"/>
	        <input type="text" id="${offpersn}" placeholder="Person" value="${person}"/>
	      </div>
			 `);
		 };
	 } else {
		 $("#officials").append( `
			<div class="onerow">
				<input type="text" id="offtitle0" placeholder="Title"/>
				<input type="text" id="offpersn0" placeholder="Person"/>
			</div>
		 `);
	 }

	 $("input[name='minchafri']").val(data.shabbos.minchaErevShabbos);
	 $("input[name='kabolo']").val(data.shabbos.kabolasShabbos);
	 $("input[name='shshacharis']").val(data.shabbos.shacharis);
	 $("input[name='shmincha']").val(data.shabbos.mincha);
	 $("input[name='shmaariv']").val(data.shabbos.maariv);

	 $("input[name='wkshach1']").val(data.weekday.shacharis1);
	 $("input[name='wkshach2']").val(data.weekday.shacharis2);
	 $("input[name='wkshach3']").val(data.weekday.shacharis3);
	 $("input[name='wkmincha']").val(data.weekday.mincha);
	 $("input[name='wkmaariv1']").val(data.weekday.maariv1);
	 $("input[name='wkmaariv2']").val(data.weekday.maariv2);
	 $("input[name='sushach1']").val(data.sundayLegalHoliday.shacharis1);
	 $("input[name='sushach2']").val(data.sundayLegalHoliday.shacharis2);
	 $("input[name='sushach3']").val(data.sundayLegalHoliday.shacharis3);

	 if (data.events.length === 0) {
		 $("#events").append(
			 `
			 <div class="onerow">
				 <textarea class="label" id="evlabl0" placeholder="Event Name"></textarea>
				 <textarea class="desc" id="evdesc0"  placeholder="Event Description"></textarea>
				 <textarea class="date" id="evdate0"  placeholder="Event When"></textarea>
			 </div>
			 `);
	 } else {
		 for (var k = 0; k < data.events.length; k++) {
			 let label = data.events[k].label;
			 let desc = data.events[k].desc;
			 let date = data.events[k].date;
			 let evlabl = "evlabl" + k;
			 let evdesc = "evdesc" + k;
			 let evdate = "evdate" + k;
			 $("#events").append ( `
				 <div class="onerow">
				   <textarea class="label" id="${evlabl}" placeholder="Event Name">${label}</textarea>
				   <textarea class="desc" id="${evdesc}"  placeholder="Event Description">${desc}</textarea>
				   <textarea class="date" id="${evdate}"  placeholder="Event When">${date}</textarea>
				 </div>
				 `);
			};
	 };

	 $("input[name='notes']").val(data.notes);

	 watchPublicSelect();
}


function watchPublicSelect() {

	$("#pub-yes").click(event => {
    event.preventDefault();
		$("input[name='public']").val("Public");
	});
	$("#pub-no").click(event => {
		event.preventDefault();
		$("input[name='public']").val("Not Public");
	});
}


function getShulData(shulIdIn) {

  let route = "/shul/" + shulIdIn;
  $.getJSON(route, function( data ) {
      if (data == "undefined" || data == null) {
          console.log("could not find shulID:" + shulIdIn);
          return;
      };
      if (data.schemaType === "shul") {
					let merge = Object.assign(shul_document, data);
				  shul_document = merge;
          displayShulData(shul_document);
			} else {
					console.log("Error with shul-id: " + shulIdIn + " - Invalid schemaType: " + data.schemaType);
			};
  });
}


function updateShulDocument(shulId) {

	if ( ! shulId) {
		console.log("Error - cannot update Shul Document with no shul-id!");
		return;
	}

	let route = "/shul/" + shulId;
  let data = shul_document;

	$.ajax({
	   url: route,
	   data: data,
	   dataType: "json",
	   success: function(shul) {
 				storage_data.logged_in = true;
 				storage_data.target = "shul";
 				storage_data.action = "display";
				storage_data.shul_id = shulId;
				setLocalStorage();
				window.location.href = "index.html";
	   },
		 error: function() {
			 console.log("Update failed for Shul-Id: " + shulId);
		 },
	   type: "PUT"
	});
}


function watchNavbarClicks() {

// --- access level will determine results -----
// 0 = not logged in
// 1 = regular member (not a shul gabbai)
// 3 = gabbai of shul
// 5 = site admin

	if ( (!storage_data.access_level) || storage_data.access_level <= 1) {
		console.log("ERROR: User with 0 or 1 access level should not have UPDT access!");
		storage_data.logged_in = false;
		storage_data.user_id = "";
		storage_data.shul_id = "";
		storage_data.shul_name = "";
		storage_data.member_id = "";
		storage_data.services_id = "";
		storage_data.target = "";
		storage_data.action = "";
		setLocalStorage();
		window.location.href = "index.html";
	};

	//     CLICKED LOGOUT ICON
	$("#js-logout-icon").click(event => {
    event.preventDefault();
    storage_data.user_email = "";
    storage_data.access_level = "";
    storage_data.logged_in = false;
    storage_data.user_id = "";
    storage_data.shul_id = "";
    storage_data.shul_name = "";
    storage_data.member_id = "";
    storage_data.services_id = "";
    storage_data.action = "";
  	storage_data.target = "";
    setLocalStorage();
    window.location.href = "index.html";
  });

	//     CLICKED SHUL ICON
  $("#js-shul-icon").click(event => {
    event.preventDefault();

    if (storage_data.access_level === 3) {
			if (storage_data.shul_id) {
				storage_data.logged_in = true;
				storage_data.target = "shul";
				storage_data.action = "display";
			} else {  // Something is wrong, make user log in again...
				storage_data.logged_in = false;
				storage_data.user_id = "";
				storage_data.shul_id = "";
				storage_data.shul_name = "";
				storage_data.member_id = "";
				storage_data.services_id = "";
				storage_data.target = "";
				storage_data.action = "";
			}
			setLocalStorage();
			window.location.href = "index.html";
    };

    if (storage_data.access_level >= 5) {
			storage_data.logged_in = true;
			storage_data.target = "shul";
			storage_data.action = "display-all";
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

	//     CLICKED MEMBER ICON
  $("#js-member-icon").click(event => {
    event.preventDefault();
    if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
			if (storage_data.shul_id) {
				storage_data.logged_in = true;
				storage_data.target = "member";
				storage_data.action = "display-all";
			} else {  // Something is wrong, make user log in again...
				storage_data.logged_in = false;
				storage_data.user_id = "";
				storage_data.shul_id = "";
				storage_data.shul_name = "";
				storage_data.member_id = "";
				storage_data.services_id = "";
				storage_data.target = "";
				storage_data.action = "";
			}
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

	//     CLICKED MEMBER UPDATE ICON
	$("#js-member-upd-icon").click(event => {
		event.preventDefault();
    if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
			if (storage_data.shul_id) {
				storage_data.logged_in = true;
				storage_data.target = "member";
				storage_data.action = "display-all";
			} else {  // Something is wrong, make user log in again...
				storage_data.logged_in = false;
				storage_data.user_id = "";
				storage_data.shul_id = "";
				storage_data.shul_name = "";
				storage_data.member_id = "";
				storage_data.services_id = "";
				storage_data.target = "";
				storage_data.action = "";
			}
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

	//     CLICKED SERVICES ICON
  $("#js-services-icon").click(event => {
    event.preventDefault();
		if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
			if (storage_data.shul_id) {
				storage_data.logged_in = true;
				storage_data.target = "services";
				storage_data.action = "display-all";
			} else {  // Something is wrong, make user log in again...
				storage_data.logged_in = false;
				storage_data.user_id = "";
				storage_data.shul_id = "";
				storage_data.shul_name = "";
				storage_data.member_id = "";
				storage_data.services_id = "";
				storage_data.target = "";
				storage_data.action = "";
			}
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

	//     CLICKED SERVICES UPD ICON
	$("#js-services-upd-icon").click(event => {
		event.preventDefault();
		if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
			if (storage_data.shul_id) {
				storage_data.logged_in = true;
				storage_data.target = "services";
				storage_data.action = "display-all";
			} else {  // Something is wrong, make user log in again...
				storage_data.logged_in = false;
				storage_data.user_id = "";
				storage_data.shul_id = "";
				storage_data.shul_name = "";
				storage_data.member_id = "";
				storage_data.services_id = "";
				storage_data.target = "";
				storage_data.action = "";
			}
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

}


function getLocalStorage() {

  if ( !storageAvailable("sessionStorage") ) {
    alert("No local storage available!  Many functions will not work....");
		window.location.href = "index.html";
	};

  let data = sessionStorage.getItem("local_storage");
  console.log("local_storage:");
  console.log(data);

  if ( !data ) {
		console.log("ERROR: Local storage is empty, send them back to login...");
		storage_data.logged_in = false;
		storage_data.user_id = "";
		storage_data.shul_id = "";
		storage_data.shul_name = "";
		storage_data.member_id = "";
		storage_data.services_id = "";
		storage_data.target = "";
		storage_data.action = "";
		setLocalStorage();
		window.location.href = "index.html";
	};

	storage_data = JSON.parse(data);

	if (storage_data.shul_name)
		$(".fs-title").text(storage_data.shul_name);

	if ( ! storage_data.target === "shul" ) {
		console.log("ERROR: target is not 'shul', send them back to login...");
		storage_data.logged_in = false;
		storage_data.user_id = "";
		storage_data.shul_id = "";
		storage_data.shul_name = "";
		storage_data.member_id = "";
		storage_data.services_id = "";
		storage_data.target = "";
		storage_data.action = "";
		setLocalStorage();
		window.location.href = "index.html";
	};

	if (storage_data.action === "update"  &&  (storage_data.shul_id) ) {
		getShulData(storage_data.shul_id);
	} else {   //  Note:  there is no 'create' action in this module
		console.log("ERROR: Invalid 'action' or 'shul-ID', send them back to login...");
		storage_data.logged_in = false;
		storage_data.user_id = "";
		storage_data.shul_id = "";
		storage_data.shul_name = "";
		storage_data.member_id = "";
		storage_data.services_id = "";
		storage_data.target = "";
		storage_data.action = "";
		setLocalStorage();
		window.location.href = "index.html";
	};

}


function setLocalStorage() {

  if (storageAvailable("sessionStorage")) {
    sessionStorage.setItem("local_storage", JSON.stringify(storage_data));
  } else {
    alert("No local storage available!  Many functions will not work....");
  };
}


function storageAvailable(type) {
    try {
        var storage = window[type],
            x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}


// prevent <enter> key from submitting form (does not disable enter in textarea)
$(document).on('keyup keypress', 'form input[type="text"]', function(e) {
  if(e.keyCode == 13) {
    e.preventDefault();
    return false;
  }
});


$(getLocalStorage);
$(watchNavbarClicks);
$(watchUpdateSubmit);
