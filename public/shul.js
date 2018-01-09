'use strict'
// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_SHUL_DATA = {
	"shulData": [
        {
            "id": "1111111",
            "adminEmail": "tzvi.dinnerman@gmail.com",
            "name": "Congregation B'nai Solomon Zalman",
            "called": "Frankel Shul",
						"public": "true",
            "address": {
              "street": "1699 President St.",
              "city": "Brooklyn",
              "state": "NY",
              "zip": "11213"
            	},
						"rabbi": "Moshe Homestein",
						"asstRabbi": "Levi Stone",
						"chazan": "Abe Sherman",
						"board": [
							{"title": "President",
							 "person": "Jack Rosenstein"
							},
							{"title": "Vice President",
							 "person": "Hershel Neuman"
						 	},
							{"title": "Treasurer",
							 "person": "Mordy Meyers"
						 	},
							{"title": "Gabbai",
							 "person": "Tzvi Dinnerman"
							}
						],
            "shabbos": {
              "minchaErevShabbos": "lichtzen",
              "kabolasShabbos": "50 min. after licht bentchn",
              "shacharis": "10:00 am",
              "mincha": "10 minutes before licht bentchn",
              "maariv": "1 hr. after licht bentchn"
            },
            "weekday": {
              "shacharis1": "6:30 am",
              "shacharis2": "7:30 am",
              "shacharis3": "",
              "mincha": "10 minutes before prev licht bentchn",
              "maariv1": "55 minutes after mincha",
              "maariv2": "9:00 pm"
            },
            "sundayLegalHoliday": {
              "shacharis1": "7:30 am",
              "shacharis2": "8:30 am",
	            "shacharis3": ""
            },
            "events": [
                {
                "label": "Shiur Moshiach and Geulah",
                "date": "Sunday evenings 8:30 pm",
                "desc": "by R. Yehudah Zirkind"
                },
                {
                "label": "Avos U'Banim",
                "date": "one hour after Shabbos ends",
                "desc": "Fathers and Sons learning program"
                }
            ],
            "notes": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getShulData(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_SHUL_DATA)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayShulData(data) {

	var i;
	for (i in data.shulData) {
		 console.log(data.shulData[i].id);
		 document.shulForm.adminEmail.value = data.shulData[i].adminEmail;
		 document.shulForm.name.value = data.shulData[i].name;
		 document.shulForm.called.value = data.shulData[i].called;
		 document.shulForm.street.value = data.shulData[i].address.street;
		 document.shulForm.city.value = data.shulData[i].address.city;
		 document.shulForm.state.value = data.shulData[i].address.state;
		 document.shulForm.zip.value = data.shulData[i].address.zip;
		 document.shulForm.rabbi.value = data.shulData[i].rabbi;
		 document.shulForm.asstRabbi.value = data.shulData[i].asstRabbi;
		 document.shulForm.chazan.value = data.shulData[i].chazan;

		 for (j in data.shulData.board) {
			 let titl = data.shulData[i].board[j].title;
			 let persn = data.shulData[i].board[j].person;
			 let nam = 'official' + j;
			 $('#officials').append( `
				 <label for="${nam}">"${titl}":</label><br>
				 <input type="text" id="${nam}" name="${nam}" value="${persn}">
				 <br>
				`);
		 }

		 document.shulForm.minchaErevShabbos.value = data.shulData[i].shabbos.minchaErevShabbos;
		 document.shulForm.kabolasShabbos.value = data.shulData[i].shabbos.kabolasShabbos;
		 document.shulForm.shacharis.value = data.shulData[i].shabbos.shacharis;
		 document.shulForm.mincha.value = data.shulData[i].shabbos.mincha;
		 document.shulForm.maariv.value = data.shulData[i].shabbos.maariv;

		 document.shulForm.shacharis1.value = data.shulData[i].weekday.shacharis1;
		 document.shulForm.shacharis2.value = data.shulData[i].weekday.shacharis2;
		 document.shulForm.shacharis3.value = data.shulData[i].weekday.shacharis3;
		 document.shulForm.minchaW.value = data.shulData[i].weekday.mincha;
		 document.shulForm.maariv1.value = data.shulData[i].weekday.maariv1;
		 document.shulForm.maariv2.value = data.shulData[i].weekday.maariv2;
		 document.shulForm.shacharisS1.value = data.shulData[i].sundayLegalHoliday.shacharis1;
		 document.shulForm.shacharisS2.value = data.shulData[i].sundayLegalHoliday.shacharis2;
		 document.shulForm.shacharisS3.value = data.shulData[i].sundayLegalHoliday.shacharis3;

		//  for (k in data.shulData.events) {
		for (var k = 0; k < data.shulData[i].events.length; k++) {
			 let event = data.shulData[i].events[k].label + '\r\n' +
			 						 data.shulData[i].events[k].desc + '\r\n' +
			  				 	 data.shulData[i].events[k].date;

			 $('#events').append( `
				 <textarea wrap="hard" name="events" rows="3">${event}</textarea><br>
			 `);
		 };

	 	 document.shulForm.notes.value = data.shulData[i].notes;
	}
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayShulData() {
	getShulData(displayShulData);
}

//  on page load do this
$(function() {
	getAndDisplayShulData();
})
