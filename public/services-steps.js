"use strict";

var SHUL_ID = "";

var services_document = {
	schemaType: "services",
	shulId: "",
	parsha: "",
	year: "",
	dateHebrew: "",
	dateEnglish: "",
	kiddush: {
		made: false,
		sponsor: "",
		pledge: "",
		paid: ""
	},
	speaker: "",
	ledDavening: {
		kabolasShabbos: "",
		shacharis: "",
		musaf: "",
		mincha: ""
	},
	aliyosShacharis: {
		kohen: {
			member: "",
			pledge: ""
		},
		levi: {
			member: "",
			pledge: ""
		},
		shlishi: {
			member: "",
			pledge: ""
		},
		revii: {
			member: "",
			pledge: ""
		},
		chamishi: {
			member: "",
			pledge: ""
		},
		shishi: {
			member: "",
			pledge: ""
		},
		shevii: {
			member: "",
			pledge: ""
		},
		maftir: {
			member: "",
			pledge: ""
		}
	},
	aliyosMincha: {
		kohen: "",
		levi: "",
		shlishi: ""
	},
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


$("#add-occaision").click (function() {

		event.preventDefault();
		let count = $("#occaisions div").length;  // occaisions already on the Page

		let occname = "#occname0";
		let occmonth = "#occmonth0";
		let occday = "#occday0";
		if ( count > 0 ) {
			occname = "#occname" + (count -1);
			occmonth = "#occmonth" + (count -1);
			occday = "#offpersn" + (count -1);
		};
		let nameval = $(occname).val();
		let monthval = $(occmonth).val();
		let dayval = $(occday).val();
		// if there already a blank input for officials on the page, don't do the add...
		if ( nameval ||  monthval ) {
		} else {
			return
		};
		occname = "occname" + count;
		occmonth = "occmonth" + count;
		occday = "occday" + count;
		$("#occaisions").append( `
		 <div class="onerow">
			 <input type="text" id="${occname}" placeholder="Occasion" />
			 <input type="text" id="${occmonth}" placeholder="Month" />
			 <input type="text" id="${occday}" placeholder="Day" />
		 </div>
		`);
})


function requiredFieldsValid() {

	let servparsha = $("input[name='servparsha']").val().trim() || "";
	let servyear = $("input[name='servyear']").val().trim() || "";
	let dateheb = $("input[name='dateheb']").val().trim() || "";
	let dateng = $("input[name='dateng']").val().trim() || "";

	if ( servparsha.length < 2 ) {
		$("#js-error-txt").text("Parsha name is required!");
		$("#js-error-alert").removeClass("hide");
		watchCloseError();
		return false;
	}

	if ( servyear.length < 2 ) {
		$("#js-error-txt").text("Parsha year is required!");
		$("#js-error-alert").removeClass("hide");
		watchCloseError();
		return false;
	}

	if ( dateheb.length < 5 ) {
		$("#js-error-txt").text("Hebrew date of services is required!");
		$("#js-error-alert").removeClass("hide");
		watchCloseError();
		return false;
	}

	if ( dateng.length < 5 ) {
		$("#js-error-txt").text("English date of services is required!");
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


function watchUpdateSubmit() {

	$(".submit").click (function(event) {
		event.preventDefault();

		if ( ! requiredFieldsValid ) {
			console.log("Quit watchUpdateSubmit-- required fields not valid.");
			return;
		}

		services_document.shulId = SHUL_ID;

		services_document.parsha = $("input[name='servparsha']").val().trim();
		services_document.year = $("input[name='servyear']").val().trim();

		services_document.dateHebrew = $("input[name='dateheb']").val().trim();
		services_document.dateEnglish = $("input[name='dateng']").val().trim();

		let kiddush = $("input[name='kiddush']").val().trim();
		if (kiddush === "Yes") {
			services_document.kiddush.made = true;
		} else {
			services_document.kiddush.made = false;
		};

		services_document.kiddush.sponsor = $("input[name='kidsponsor']").val().trim();
		services_document.kiddush.pledge = $("input[name='kidpledge']").val().trim();
		services_document.kiddush.paid = $("input[name='kidpaid']").val().trim();

		services_document.speaker = $("input[name='speaker']").val().trim();

		services_document.ledDavening.kabolasShabbos = $("input[name='ledkabshab']").val().trim();
		services_document.ledDavening.shacharis = $("input[name='ledschach']").val().trim();
		services_document.ledDavening.musaf = $("input[name='ledmusaf']").val().trim();
		services_document.ledDavening.mincha = $("input[name='ledmincha']").val().trim();

		services_document.aliyosShacharis.kohen.member = $("input[name='alkohen']").val().trim();
		services_document.aliyosShacharis.kohen.pledge = $("input[name='alkohenplg']").val().trim();
		services_document.aliyosShacharis.levi.member = $("input[name='allevi']").val().trim();
		services_document.aliyosShacharis.levi.pledge = $("input[name='alleviplg']").val().trim();
		services_document.aliyosShacharis.shlishi.member = $("input[name='al3']").val().trim();
		services_document.aliyosShacharis.shlishi.pledge = $("input[name='al3plg']").val().trim();
		services_document.aliyosShacharis.revii.member = $("input[name='al4']").val().trim();
		services_document.aliyosShacharis.revii.pledge = $("input[name='al4plg']").val().trim();
		services_document.aliyosShacharis.chamishi.member = $("input[name='al5']").val().trim();
		services_document.aliyosShacharis.chamishi.pledge = $("input[name='al5plg']").val().trim();
		services_document.aliyosShacharis.shishi.member = $("input[name='al6']").val().trim();
		services_document.aliyosShacharis.shishi.pledge = $("input[name='al6plg']").val().trim();
		services_document.aliyosShacharis.shevii.member = $("input[name='al7']").val().trim();
		services_document.aliyosShacharis.shevii.pledge = $("input[name='al7plg']").val().trim();
		services_document.aliyosShacharis.maftir.member = $("input[name='almaftir']").val().trim();
		services_document.aliyosShacharis.maftir.pledge = $("input[name='almaftplg']").val().trim();

		services_document.aliyosMincha.kohen = $("input[name='alminkohen']").val().trim();
		services_document.aliyosMincha.levi = $("input[name='alminlevi']").val().trim();
		services_document.aliyosMincha.shlishi = $("input[name='almin3']").val().trim();

		services_document.notes = $("#notes").val().trim();

		if (storage_data.action === "update") {
			updateServicesDocument(storage_data.services_id);
		} else {
				delete services_document["_id"];
				createServicesDocument(services_document);
		};

	})
}


function displayServicesData(data) {

	$("input[name='servparsha']").val(data.parsha);
	$("input[name='servyear']").val(data.year);
	$("input[name='dateheb']").val(data.dateHebrew);
	$("input[name='dateng']").val(data.dateEnglish);

	if (data.kiddush.made)  { $("input[name='kiddush']").val("Yes"); }
	else                    { $("input[name='kiddush']").val("No");  }

	$("input[name='kidsponsor']").val(data.kiddush.sponsor);
	$("input[name='kidpledge']").val(data.kiddush.pledge);
	$("input[name='kidpaid']").val(data.kiddush.paid);

	$("input[name='speaker']").val(data.speaker);

	$("input[name='ledkabshab']").val(data.ledDavening.kabolasShabbos);
	$("input[name='ledschach']").val(data.ledDavening.shacharis);
	$("input[name='ledmusaf']").val(data.ledDavening.musaf);
	$("input[name='ledmincha']").val(data.ledDavening.mincha);

	$("input[name='alkohen']").val(data.aliyosShacharis.kohen.member);
	$("input[name='alkohenplg']").val(data.aliyosShacharis.kohen.pledge);
	$("input[name='allevi']").val(data.aliyosShacharis.levi.member);
	$("input[name='alleviplg']").val(data.aliyosShacharis.levi.pledge);
	$("input[name='al3']").val(data.aliyosShacharis.shlishi.member);
	$("input[name='al3plg']").val(data.aliyosShacharis.shlishi.pledge);
	$("input[name='al4']").val(data.aliyosShacharis.revii.member);
	$("input[name='al4plg']").val(data.aliyosShacharis.revii.pledge);
	$("input[name='al5']").val(data.aliyosShacharis.chamishi.member);
	$("input[name='al5plg']").val(data.aliyosShacharis.chamishi.pledge);
	$("input[name='al6']").val(data.aliyosShacharis.shishi.member);
	$("input[name='al6plg']").val(data.aliyosShacharis.shishi.pledge);
	$("input[name='al7']").val(data.aliyosShacharis.shevii.member);
	$("input[name='al7plg']").val(data.aliyosShacharis.shevii.pledge);
	$("input[name='almaftir']").val(data.aliyosShacharis.maftir.member);
	$("input[name='almaftplg']").val(data.aliyosShacharis.maftir.pledge);

	$("input[name='alminkohen']").val(data.aliyosMincha.kohen);
	$("input[name='alminlevi']").val(data.aliyosMincha.levi);
	$("input[name='almin3']").val(data.aliyosMincha.shlishi);

  $("#notes").val(data.notes);

	 watchBooleanSelects();
}


function watchBooleanSelects() {

	$("#kiddush-yes").click(event => {
    event.preventDefault();
		$("input[name='kiddush']").val("Yes");
	});
	$("#kiddush-no").click(event => {
		event.preventDefault();
		$("input[name='kiddush']").val("No");
	});

}


function getServicesData(servicesIdIn) {

  let route = "/services/" + servicesIdIn;

  $.getJSON(route, function( data ) {
      if (data == "undefined" || data == null) {
          console.log("could not find servicesID:" + servicesIdIn);
          return;
      };
      if (data.schemaType === "services") {
				let merge = Object.assign(services_document, data);
			  services_document = merge;
        displayServicesData(services_document);
      } else {
				console.log("Error with services-id: " + servicesIdIn + " - Invalid schemaType: " + data.schemaType);
			};
  });
}


function updateServicesDocument(servicesId) {

	if ( ! servicesId) {
		console.log("Error - cannot update Services Document with no services-id!");
		return;
	}

	let route = "/services/" + servicesId;
  let data = services_document;

	$.ajax({
	   url: route,
	   data: data,
	   dataType: "json",
	   success: function(data) {
 				storage_data.logged_in = true;
 				storage_data.target = "services";
 				storage_data.action = "display";
 				storage_data.services_id = servicesId;
				setLocalStorage();
				window.location.href = "index.html";
	   },
		 error: function() {
			 console.log("Update failed for Services-id: " + servicesId);
		 },
	   type: "PUT"
	});
}


function createServicesDocument (dataIn) {

	let route = "/services/";
  let data = dataIn;

  $.ajax({
    url: route,
    method: "POST",
    processData: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json" })
    .done (function( services ) {
			storage_data.logged_in = true;
      storage_data.services_id = services._id;
			storage_data.target = "services";
			storage_data.action = "display";
			setLocalStorage();
			window.location.href = "index.html";
    })
  .fail(function(err) {
    // responseJSON   status
    console.log("Error creating new Services Document:");
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
			};
			setLocalStorage();
			window.location.href = "index.html";
    };
  });

	//     CLICKED SERVICES UPD ICON
	$("#js-services-upd-icon").click(event => {
		event.preventDefault();

		//  if we are in update mode, switch to create mode
		if (storage_data.action = "update") {
			storage_data.action = "create";
			storage_data.services_id = "";

			services_document.schemaType = "services";
			services_document.shulId = SHUL_ID;

			services_document.parsha = "";
			services_document.year = "";
			services_document.dateHebrew = "";
			services_document.dateEnglish = "";
			services_document.kiddush.made = false;
			services_document.kiddush.sponsor = "";
			services_document.kiddush.pledge = "";
			services_document.kiddush.paid = "";
			services_document.speaker = "";
			services_document.ledDavening.kabolasShabbos = "";
			services_document.ledDavening.shacharis = "";
			services_document.ledDavening.musaf = "";
			services_document.ledDavening.mincha = "";
			services_document.aliyosShacharis.kohen.member = "";
			services_document.aliyosShacharis.kohen.pledge = "";
			services_document.aliyosShacharis.levi.member = "";
			services_document.aliyosShacharis.levi.pledge = "";
			services_document.aliyosShacharis.shlishi.member = "";
			services_document.aliyosShacharis.shlishi.pledge = "";
			services_document.aliyosShacharis.revii.member = "";
			services_document.aliyosShacharis.revii.pledge = "";
			services_document.aliyosShacharis.chamishi.member = "";
			services_document.aliyosShacharis.chamishi.pledge = "";
			services_document.aliyosShacharis.shishi.member = "";
			services_document.aliyosShacharis.shishi.pledge = "";
			services_document.aliyosShacharis.shevii.member = "";
			services_document.aliyosShacharis.shevii.pledge = "";
			services_document.aliyosShacharis.maftir.member = "";
			services_document.aliyosShacharis.maftir.pledge = "";
			services_document.aliyosMincha.kohen = "";
			services_document.aliyosMincha.levi = "";
			services_document.aliyosMincha.shlishi = "";
			services_document.notes = "";

			delete services_document["_id"];

		  displayServicesData(services_document);
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

	if ( ! storage_data.target === "services" ) {
		console.log("ERROR: target is not 'services', send them back to login...");
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
		$(".fs-title").text("Services " + storage_data.shul_name);

	if (storage_data.shul_id)
		SHUL_ID = storage_data.shul_id;

	if (storage_data.action === "update"  &&  (storage_data.services_id) ) {
				getServicesData(storage_data.services_id);
	} else {   //  create new Services Document
		if (SHUL_ID) {
			storage_data.action = "create";
	    displayServicesData(services_document);
		} else {
			console.log("Error - No services_id or shul_id was passed in!")
		}
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
