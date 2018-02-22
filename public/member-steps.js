"use strict";

var SHUL_ID = "";

var member_document = {
	schemaType: "member",
	shulId: "",
	familyName: "",
	hebrewNameFull: "",
	englishName: "",
	called: "",
	regular: true,
	contactInfo: {
		eMail: "",
		cellPhone: "",
		homeAddress: {
			street: "",
			city: "",
			state: "",
			zip: "",
			addrNotes: ""
		}
	},
	fatherHebrewName: "",
	motherHebrewName: "",
	title: "",
	kohen: false,
	levi: false,
	lastAliya: {
		parsha: "",
		year: "",
		aliya: ""
	},
	canLeadDavening: false,
	lastLedDavening: {
		parsha: "",
		year: "",
		tefilla: ""
	},
	notes: "",
	occaisions: [{
		 name: "",
		 month: "",
		 day: ""
 }]
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
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
			next_fs.css({'left': left, 'opacity': opacity});
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
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
	});
});


$("#add-occaision").click (function() {

		event.preventDefault();
		let count = $("#occaisions div").length;  // occaisions already on the Page

		let occname = '#occname0';
		let occmonth = '#occmonth0';
		let occday = '#occday0';
		if ( count > 0 ) {
			occname = '#occname' + (count -1);
			occmonth = '#occmonth' + (count -1);
			occday = '#offpersn' + (count -1);
		};
		let nameval = $(occname).val();
		let monthval = $(occmonth).val();
		let dayval = $(occday).val();
		// if there already a blank input for officials on the page, don't do the add...
		if ( nameval ||  monthval ) {
		} else {
			return
		};
		occname = 'occname' + count;
		occmonth = 'occmonth' + count;
		occday = 'occday' + count;
		$('#occaisions').append( `
		 <div class="onerow">
			 <input type="text" id="${occname}" placeholder="Occasion" />
			 <input type="text" id="${occmonth}" placeholder="Month" />
			 <input type="text" id="${occday}" placeholder="Day" />
		 </div>
		`);
})


function requiredFieldsValid() {

	let called = $("input[name='called']").val().trim() || "";
	let hebrewname = $("input[name='hebrewname']").val().trim() || "";
	let englishname = $("input[name='englishname']").val().trim() || "";
	let familyname = $("input[name='familyname']").val().trim() || "";

	if ( called.length < 2 ) {
		$('#js-error-txt').text("Nickname is required!");
		$('#js-error-alert').removeClass("hide");
		watchCloseError();
		return false;
	}

	if ( hebrewname.length < 2 ) {
		$('#js-error-txt').text("Hebrew name is required!");
		$('#js-error-alert').removeClass("hide");
		watchCloseError();
		return false;
	}

	if ( englishname.length < 2 ) {
		$('#js-error-txt').text("English name is required!");
		$('#js-error-alert').removeClass("hide");
		watchCloseError();
		return false;
	}

	if ( familyname.length < 2 ) {
		$('#js-error-txt').text("Family name is required!");
		$('#js-error-alert').removeClass("hide");
		watchCloseError();
		return false;
	}

	return true;
}


function watchCloseError() {

  $('#js-error-alert').click(event => {
    event.preventDefault();
    $('#js-error-alert').addClass("hide");
  });
}


function watchUpdateSubmit() {

	$(".submit").click (function(event) {
		event.preventDefault();

		if ( ! requiredFieldsValid ) {
			console.log("Quit watchUpdateSubmit-- required fields not valid.");
			return;
		}

		member_document.shulId = SHUL_ID;
		member_document.familyName = $("input[name='familyname']").val().trim();
		member_document.hebrewNameFull = $("input[name='hebrewname']").val().trim();
		member_document.englishName = $("input[name='englishname']").val().trim();
		member_document.called = $("input[name='called']").val().trim();
		member_document.title = $("input[name='title']").val().trim();

		let reg = $("input[name='regular']").val().trim();
		if (reg === "Yes") {
			member_document.regular = true;
		} else {
			member_document.regular = false;
		}

		let lead = $("input[name='canlead']").val().trim();
		if (lead === "Yes") {
			member_document.canLeadDavening = true;
		} else {
			member_document.canLeadDavening = false;
		}

		let kohen = $("input[name='kohen']").val().trim();
		if (kohen === "Yes") {
			member_document.kohen = true;
		} else {
			member_document.kohen = false;
		}

		let levi = $("input[name='levi']").val().trim();
		if (levi === "Yes") {
			member_document.levi = true;
		} else {
			member_document.levi = false;
		}

		member_document.contactInfo.eMail = $("input[name='email']").val().trim();
		member_document.contactInfo.cellPhone = $("input[name='cell']").val().trim();
		member_document.contactInfo.homeAddress.street = $("input[name='street']").val().trim();
		member_document.contactInfo.homeAddress.city = $("input[name='city']").val().trim();
		member_document.contactInfo.homeAddress.state = $("input[name='state']").val().trim();
		member_document.contactInfo.homeAddress.zip = $("input[name='zip']").val().trim();
		member_document.contactInfo.homeAddress.addrNotes = $("input[name='addrnotes']").val().trim();

		member_document.fatherHebrewName = $("input[name='fatherheb']").val().trim();
		member_document.motherHebrewName = $("input[name='motherheb']").val().trim();

		member_document.lastAliya.parsha = $("input[name='aliyaparsha']").val().trim();
		member_document.lastAliya.year = $("input[name='aliyayear']").val().trim();
		member_document.lastAliya.aliya = $("input[name='aliya']").val().trim();

		member_document.lastLedDavening.parsha = $("input[name='ledparsha']").val().trim();
		member_document.lastLedDavening.year = $("input[name='ledyear']").val().trim();
		member_document.lastLedDavening.tefilla = $("input[name='tefilla']").val().trim();

		member_document.notes = $("#notes").val().trim();

		let count = $("#occaisions div").length;
		if (count > 0) {
			let name = "";
			let month = "";
			let day = "";
			let occasStr = '{"occaisions": [';
			for (var i = 0; i < count; i++) {
				let occname = '#occname' + i;
				let occmonth = '#occmonth' + i;
				let occday = '#occday' + i;
				name = $(occname).val().trim();
				month = $(occmonth).val().trim();
				day = $(occday).val().trim();
				occasStr = occasStr + ' {"name":' + '"' + name + '"'
														+ ',"month":'   + '"' + month  + '"'
														+ ',"day":'   + '"' + day   + '"'  + '}';
				if (i+1 === count) {    // if it's the last item, no comma at end
				} else {
					occasStr = occasStr + ",";
				};
			}; // for
			occasStr = occasStr + "] }";
			let occaisObj = JSON.parse(occasStr);
			let merge = Object.assign(member_document, occaisObj);
			member_document = merge;
		};   // count > 0

		console.log(member_document);

		if (storage_data.action === 'update') {
			updateMemberDocument(storage_data.member_id);
		} else {
				delete member_document["_id"];
				createMemberDocument(member_document);
		};

	})
}


function displayMemberData(data) {

	$("input[name='familyname']").val(data.familyName);
	$("input[name='hebrewname']").val(data.hebrewNameFull);
	$("input[name='englishname']").val(data.englishName);
	$("input[name='called']").val(data.called);
	$("input[name='title']").val(data.title);

	if (data.regular)  { $("input[name='regular']").val("Yes"); }
	else               { $("input[name='regular']").val("No");  }

	if (data.kohen)    { $("input[name='kohen']").val("Yes"); }
	else               { $("input[name='kohen']").val("No");  }

	if (data.levi)     { $("input[name='levi']").val("Yes"); }
	else               { $("input[name='levi']").val("No");  }

	if (data.canLeadDavening)  { $("input[name='canlead']").val("Yes"); }
	else              				 { $("input[name='canlead']").val("No");  }

	$("input[name='email']").val(data.contactInfo.eMail);
	$("input[name='cell']").val(data.contactInfo.cellPhone);
	$("input[name='street']").val(data.contactInfo.homeAddress.street);
	$("input[name='city']").val(data.contactInfo.homeAddress.city);
	$("input[name='state']").val(data.contactInfo.homeAddress.state);
	$("input[name='zip']").val(data.contactInfo.homeAddress.zip);
	$("input[name='addrnotes']").val(data.contactInfo.homeAddress.addrNotes);

	$("input[name='fatherheb']").val(data.fatherHebrewName);
	$("input[name='motherheb']").val(data.motherHebrewName);

 	$("input[name='aliyaparsha']").val(data.lastAliya.parsha);
 	$("input[name='aliyayear']").val(data.lastAliya.year);
 	$("input[name='aliya']").val(data.lastAliya.aliya);

 	$("input[name='ledparsha']").val(data.lastLedDavening.parsha);
 	$("input[name='ledyear']").val(data.lastLedDavening.year);
 	$("input[name='tefilla']").val(data.lastLedDavening.tefilla);

  $("#notes").val(data.notes);

  if (data.occaisions.length === 0) {
	 $('#occaisions').append(
		 `
		 <div class="onerow">
			 <textarea class="flex1" id="occname0" placeholder="Occaision Name"></textarea>
			 <textarea class="flex1" id="occmonth0"  placeholder="Occaision Month"></textarea>
			 <textarea class="flex1" id="occday0"  placeholder="Occaision Day"></textarea>
		 </div>
		 `);
  } else {
	 for (var k = 0; k < data.occaisions.length; k++) {
		 let name = data.occaisions[k].name;
		 let month = data.occaisions[k].month;
		 let day = data.occaisions[k].day;
		 let occname = 'occname' + k;
		 let occmonth = 'occmonth' + k;
		 let occday = 'occday' + k;
		 $('#occaisions').append ( `
			 <div class="onerow">
			   <textarea class="flex1" id="${occname}" placeholder="Occaision Name">${name}</textarea>
			   <textarea class="flex1" id="${occmonth}"  placeholder="Occaision Month">${month}</textarea>
			   <textarea class="flex1" id="${occday}"  placeholder="Occaision Day">${day}</textarea>
			 </div>
			 `);
		};
  };

	 watchBooleanSelects();
}


function watchBooleanSelects() {

	$('#reg-yes').click(event => {
    event.preventDefault();
		$("input[name='regular']").val("Yes");
	});
	$('#reg-no').click(event => {
		event.preventDefault();
		$("input[name='regular']").val("No");
	});

	$('#lead-yes').click(event => {
    event.preventDefault();
		$("input[name='canlead']").val("Yes");
	});
	$('#lead-no').click(event => {
		event.preventDefault();
		$("input[name='canlead']").val("No");
	});

	$('#koh-yes').click(event => {
    event.preventDefault();
		$("input[name='kohen']").val("Yes");
	});
	$('#koh-no').click(event => {
		event.preventDefault();
		$("input[name='kohen']").val("No");
	});

	$('#lev-yes').click(event => {
    event.preventDefault();
		$("input[name='levi']").val("Yes");
	});
	$('#lev-no').click(event => {
		event.preventDefault();
		$("input[name='levi']").val("No");
	});
}


function getMemberData(memberIdIn) {

  console.log('member ID: ' + memberIdIn);
  let route = '/member/' + memberIdIn;

  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
          console.log("could not find memberID:" + memberIdIn);
          return;
      };
      if (data.schemaType === 'member') {
				let merge = Object.assign(member_document, data);
			  member_document = merge;
        displayMemberData(member_document);
      } else {
				console.log("Error with member-id: " + memberIdIn + " - Invalid schemaType: " + data.schemaType);
			};
  });
}


function updateMemberDocument(memberId) {

	if ( ! memberId) {
		console.log("Error - cannot update Member Document with no member-id!");
		return;
	}

	let route = '/member/' + memberId;
  let data = member_document;

	$.ajax({
	   url: route,
	   data: data,
	   dataType: 'json',
	   success: function(data) {
			  console.log("successful update for Member-id: " + memberId);
 				storage_data.logged_in = true;
 				storage_data.target = "member";
 				storage_data.action = "display";
 				storage_data.member_id = memberId;
				setLocalStorage();
				window.location.href = "index.html";
	   },
		 error: function() {
			 console.log("Update failed for Member-id: " + memberId);
		 },
	   type: 'PUT'
	});
}


function createMemberDocument (dataIn) {

	let route = '/member/';
  let data = dataIn;

	console.log(JSON.stringify(dataIn));

  $.ajax({
    url: route,
    method: "POST",
    processData: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json" })
    .done (function( member ) {
      console.log("New Member created:");
      console.log(member);
			storage_data.logged_in = true;
      storage_data.member_id = member._id;
			storage_data.target = "member";
			storage_data.action = "display";
			setLocalStorage();
			window.location.href = "index.html";
    })
  .fail(function(err) {
    // responseJSON   status
    console.log("Error creating new Member:");
    console.log(err);
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

	//     CLICKED SHUL ICON
  $('#js-shul-icon').click(event => {
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
  $('#js-member-icon').click(event => {
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
	$('#js-member-upd-icon').click(event => {
		event.preventDefault();

		//  if we are in update mode, switch to create mode
		if (storage_data.action = "update") {
			storage_data.action = "create";
			storage_data.member_id = "";

			member_document.schemaType = "member";
			member_document.shulId = SHUL_ID;

			member_document.familyName = "";
			member_document.hebrewNameFull = "";
			member_document.englishName = "";
			member_document.called = "";
			member_document.title = "";
			member_document.regular = false;
			member_document.canLeadDavening = false;
			member_document.kohen = false;
			member_document.levi = false;
			member_document.contactInfo.eMail = "";
			member_document.contactInfo.cellPhone = "";
			member_document.contactInfo.homeAddress.street = "";
			member_document.contactInfo.homeAddress.city = "";
			member_document.contactInfo.homeAddress.state = "";
			member_document.contactInfo.homeAddress.zip = "";
			member_document.contactInfo.homeAddress.addrNotes = "";
			member_document.fatherHebrewName = "";
			member_document.motherHebrewName = "";
			member_document.lastAliya.parsha = "";
			member_document.lastAliya.year = "";
			member_document.lastAliya.aliya = "";
			member_document.lastLedDavening.parsha = "";
			member_document.lastLedDavening.year = "";
			member_document.lastLedDavening.tefilla = "";
			member_document.occaisions = [{ "name": "", "month": "", "day": "" }];
			member_document.notes = "";
			delete member_document["_id"];
			// Clear all HTML child elements that may have been added by the user
			var element = document.getElementById("occaisions");
			while (element.firstChild) {
			  element.removeChild(element.firstChild);
			}

		  displayMemberData(member_document);
		};

  });

	//     CLICKED SERVICES ICON
  $('#js-services-icon').click(event => {
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
			};
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

	//     CLICKED SERVICES UPD ICON
	$('#js-services-upd-icon').click(event => {
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

  if ( !storageAvailable('sessionStorage') ) {
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

	if ( ! storage_data.target === "member" ) {
		console.log("ERROR: target is not 'member', send them back to login...");
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

	if (storage_data.shul_name)
		$(".fs-title").text("Member " + storage_data.shul_name);

	if (storage_data.shul_id)
		SHUL_ID = storage_data.shul_id;

	if (storage_data.action === "update"  &&  (storage_data.member_id) ) {
				getMemberData(storage_data.member_id);
	} else {   //  create new Member
		if (SHUL_ID) {
			storage_data.action = "create";
	    displayMemberData(member_document);
		} else {
			console.log("Error - No member_id or shul_id was passed in!")
		}
	};

}


function setLocalStorage() {

  if (storageAvailable('sessionStorage')) {
    sessionStorage.setItem("local_storage", JSON.stringify(storage_data));
  } else {
    alert("No local storage available!  Many functions will not work....");
  };
}


function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
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
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
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
