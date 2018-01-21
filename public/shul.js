'use strict'

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
		 document.shulForm.adminEmail.value = data.adminEmail;
		 document.shulForm.name.value = data.name;
		 document.shulForm.called.value = data.called;
		 document.shulForm.street.value = data.address.street;
		 document.shulForm.city.value = data.address.city;
		 document.shulForm.state.value = data.address.state;
		 document.shulForm.zip.value = data.address.zip;
		 document.shulForm.rabbi.value = data.rabbi;
		 document.shulForm.asstRabbi.value = data.asstRabbi;
		 document.shulForm.chazan.value = data.chazan;

		 for (var j in data.board) {
			 let titl = data.board[j].title;
			 let persn = data.board[j].person;
			 let nam = 'official' + j;
			 $('#officials').append( `
				 <label for="${nam}">"${titl}":</label><br>
				 <input type="text" id="${nam}" name="${nam}" value="${persn}">
				 <br>
				`);
		 }

		 document.shulForm.minchaErevShabbos.value = data.shabbos.minchaErevShabbos;
		 document.shulForm.kabolasShabbos.value = data.shabbos.kabolasShabbos;
		 document.shulForm.shacharis.value = data.shabbos.shacharis;
		 document.shulForm.mincha.value = data.shabbos.mincha;
		 document.shulForm.maariv.value = data.shabbos.maariv;

		 document.shulForm.shacharis1.value = data.weekday.shacharis1;
		 document.shulForm.shacharis2.value = data.weekday.shacharis2;
		 document.shulForm.shacharis3.value = data.weekday.shacharis3;
		 document.shulForm.minchaW.value = data.weekday.mincha;
		 document.shulForm.maariv1.value = data.weekday.maariv1;
		 document.shulForm.maariv2.value = data.weekday.maariv2;
		 document.shulForm.shacharisS1.value = data.sundayLegalHoliday.shacharis1;
		 document.shulForm.shacharisS2.value = data.sundayLegalHoliday.shacharis2;
		 document.shulForm.shacharisS3.value = data.sundayLegalHoliday.shacharis3;

		//  for (k in data.events) {
		for (var k = 0; k < data.events.length; k++) {
			 let event = data.events[k].label + '\r\n' +
			 						 data.events[k].desc + '\r\n' +
			  				 	 data.events[k].date;

			 $('#events').append( `
				 <textarea wrap="hard" name="events" rows="3">${event}</textarea><br>
			 `);
		 };

	 	 document.shulForm.notes.value = data.notes;
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

// function watchXxxxxxSubmit() {
//
//   $('#js-login').click(event => {
//     event.preventDefault();
//     // validate email format
//   });
// }
//
//
// function getLoginCredentials(email, pw) {
// // use this as a model for the POST/PUT
//
//   let route = '/user-login/';
//   let data = { "emailIn": email, "pwIn": pw};
//
//   // $.getJSON(route, data, function( user ) {
//   $.ajax({
//     url: route,
//     method: "POST",
//     processData: false,
//     data: JSON.stringify(data),
//     dataType: "json",
//     contentType: "application/json" })
//     .done (function( user ) {
//       console.log(user);
//       if (user.error) {
//         if (user.error.type === 'user') {
//           $('#js-email-error-txt').text(user.error.msg);
//           $('#js-email-error').removeClass("hide");
//           $('#js-login-container').height("65vh");
//           watchCloseError();
//           return;
//         }
//         if (user.error.type === 'password') {
//           $('#js-pw-error-txt').text(user.error.msg);
//           $('#js-pw-error').removeClass("hide");
//           $('#js-login-container').height("65vh");
//           watchCloseError();
//           return;
//         }
//         console.log("Error type: " + user.error.type + " Msg: " + user.error.msg )
//         $('#js-email-error-txt').text("Login failed.  Unknown error- notify admin");
//         $('#js-email-error').removeClass("hide");
//         $('#js-login-container').height("65vh");
//         watchCloseError();
//         return;
//       };
//
//       if (user.schemaType) {
//         storage_data.user_email = user.email;
//         storage_data.access_level = user.accessLevel;
//         storage_data.logged_in = true;
//         storage_data.user_id = user.id;
//         storage_data.shul_id = user.shulId;
//         // storage_data.member_id = user.email;
//         // storage_data.services_id = user.email;
//         // storage_data.shul_name = shul
//
//         if (storage_data.access_level <= 1) {
//           if (storage_data.shul_id) {
//             displayShulData(storage_data.shul_id);
//           } else {
//             let route = '/shul-all-public';
//             $.getJSON(route, function( data ) {
//                 renderShulList(data);
//             });
//           };
//         };
//
//         if (storage_data.access_level === 3) {
//           displayShulData(storage_data.shul_id);
//         };
//
//         if (storage_data.access_level >= 5) {
//           let route = '/shul-all';
//           storage_data.shul_id = "";
//           $.getJSON(route, function( data ) {
//               renderShulList(data);
//           });
//         };
//
//       };  // user object returned
//     })
//   .fail(function(err) {
//     // responseJSON   status
//
//     console.log(err);
//   });
// }
//
//
// function formatPhone(input) {
//         input = input.toString();
//         // Strip all characters from the input except digits
//         input = input.replace(/\D/g,'');
//         // Trim the remaining input to ten characters, to preserve phone number format
//         input = input.substring(0,10);
//         // Based upon the length of the string, we add formatting as necessary
//         var size = input.length;
//         if(size == 0){
//                 input = input;
//         }else if(size < 4){
//                 input = '('+input;
//         }else if(size < 7){
//                 input = '('+input.substring(0,3)+') '+input.substring(3,6);
//         }else{
//                 input = '('+input.substring(0,3)+') '+input.substring(3,6)+'-'+input.substring(6,10);
//         }
//         return input;
// }
//
//
// function validateEmail(mail) {
//  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
//   { return (true) };
// return (false);
// }
