"use strict";

var shul_document = {
	"schemaType": "",
	"adminEmail": "",
	"name": "",
	"called": "",
	"public": false,
	"address": {
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
  "logged_in": false,
  "user_id": "",
  "shul_id": "",
  "shul_name": "",
  "member_id": "",
  "services_id": "",
};

var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale;             //fieldset properties which we will animate
var animating;                        //flag to prevent quick multi-click glitches

$(".next").click(function(){
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

$(".previous").click(function(){
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


function watchUpdateSubmit() {

	$(".submit").click(function(event){
		event.preventDefault();
		shul_document.adminEmail = $("input[name='admin']").val().trim();
		shul_document.name = $("input[name='name']").val().trim();
		shul_document.called = $("input[name='called']").val().trim();
		shul_document.address.street = $("input[name='street']").val().trim();
		shul_document.address.city = $("input[name='city']").val().trim();
		shul_document.address.state = $("input[name='state']").val().trim();
		shul_document.address.zip = $("input[name='zip']").val().trim();
		shul_document.rabbi = $("input[name='rabbi']").val().trim();
		shul_document.asstRabbi = $("input[name='asstrabbi']").val().trim();
		shul_document.chazan = $("input[name='chazan']").val().trim();

		let count = $("#officials div").length;
		let title = "";
		let person = "";
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				let offtitle = '#offtitle' + i;
				let offpersn = '#offpersn' + i;
				console.log(count + ' ' + offtitle );
				shul_document.board[i].title = $(offtitle).val().trim();
				shul_document.board[i].person = $(offpersn).val().trim();
			};
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
		let label = "";
		let desc = "";
		let date = "";
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				let evlabl = '#evlabl' + i;
				let evdesc = '#evdesc' + i;
				let evdat = '#evdat' + i;
				shul_document.events[i].label = $(evlabl).val().trim();
				shul_document.events[i].desc = $(evdesc).val().trim();
				shul_document.events[i].date = $(evdat).val().trim();
			}
		};

		shul_document.notes = $("#notes").val().trim();

		console.log(shul_document);
		// postShulDocument(shul_document);

	})
}

function getLocalStorage() {

  if (storageAvailable('sessionStorage')) {
    let data = sessionStorage.getItem("local_storage");
    console.log(data);
    if (data) {
      storage_data = JSON.parse(data);
			getShulData(storage_data.shul_id);
    } else {
        alert("Warning--Local storage is empty!");
    };
  } else {
    alert("No local storage available!  Many functions will not work....");
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


function displayShulData(data) {

		 console.log("shul ID: " + data._id);
		 // document.shulform.admin.value = data.adminEmail;
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

		 for (var j in data.board) {
			 let title = data.board[j].title;
			 let person = data.board[j].person;
			 let offtitle = 'offtitle' + j;
			 let offpersn = 'offpersn' + j;
			 $('#officials').append( `
				<div class="onerow">
	        <input type="text" id="${offtitle}" placeholder="Title" value="${title}"/>
	        <input type="text" id="${offpersn}" placeholder="Person" value="${person}"/>
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
			 $('#events').append(
				 `
				 <div class="onerow">
					 <input class="label" type="text" id="evlabl0" placeholder="Event Text"/>
					 <input class="desc" type="text"  id="evdesc0" placeholder="Event Description" />
					 <input class="date" type="text"  id="evdat0" placeholder="Event When" />
				 </div>
				 `);
		 } else {
			 for (var k = 0; k < data.events.length; k++) {
				 let label = data.events[k].label;
				 let desc = data.events[k].desc;
				 let date = data.events[k].date;
				 let evlabl = 'evlabl' + k;
				 let evdesc = 'evdesc' + k;
				 let evdat = 'evdat' + k;
				 $('#events').append ( `
					 <div class="onerow">
					   <textarea class="label expandable" id="${evlabl}" placeholder="Event Text">${label}</textarea>
					   <textarea class="desc expandable" id="${evdesc}" placeholder="More Text">${desc}</textarea>
					   <textarea class="date expandable" id="${evdat}" placeholder="Event When">${date}</textarea>
					 </div>
					 `);
				};
		 };

		 $("input[name='notes']").val(data.notes);
}


function getShulData(shulIdIn) {

  console.log('shul ID: ' + shulIdIn);
  let route = '/shul/' + shulIdIn;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
          // modal - invalid shul ID
          console.log('could not find shulID:' + shulIdIn);
          return;
      };
      if (data.schemaType === 'shul') {
				  shul_document = data;
          displayShulData(data);
      };
  });
}


function watchNavbarClicks() {

// --- access level will determine results -----
// 0 = not logged in
// 1 = regular member (not a shul gabbai)
// 3 = gabbai of shul
// 5 = site admin

	return;  // need to work out logic.....

	//     CLICKED SHUL ICON
  $('#js-shul-icon').click(event => {
    event.preventDefault();

    if (storage_data.access_level <= 1) {
      let route = '/shul-all-public';
      $.getJSON(route, function( data ) {
          renderShulList(data);
      });
    };

    if (storage_data.access_level === 3) {
      if (storage_data.shul_id)
        displayShulData(storage_data.shul_id);
    };

    if (storage_data.access_level >= 5) {
      let route = '/shul-all';
      $.getJSON(route, function( data ) {
          renderShulList(data);
      });
    };
  });

	//     CLICKED MEMBER ICON
  $('#js-member-icon').click(event => {
    event.preventDefault();
    if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
      let route = '/member-all/' + storage_data.shul_id ;
      $.getJSON(route, function( data ) {
          renderMemberList(data);
      });
    };
  });

	//     CLICKED SERVICES ICON
  $('#js-services-icon').click(event => {
    event.preventDefault();
    if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
      if (storage_data.shul_id) {
        let route = '/services-all/' + storage_data.shul_id ;
        $.getJSON(route, function( data ) {
            renderServicesList(data);
        });
      } else {
        console.log("ERROR: Cannot Display Services Without ShulID!");
      };
    };
  });

}


$(getLocalStorage);
$(watchNavbarClicks);
$(watchUpdateSubmit);
$(".expandable").height( $("textarea")[0].scrollHeight );  // make textarea expandable
