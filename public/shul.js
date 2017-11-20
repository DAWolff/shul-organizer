// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_SHUL_DATA = {
	"shulData": [
        {
            "id": "1111111",
            "adminEmail": "tzvi.dinnerman@gmail.com",
            "name": "Congregation B'nai Solomon Zalman",
            "called": "Frankel Shul",
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
                },
            ],
            "notes": "notes"
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
  for (i in data.shulData) {
	   $('#shulInfo').append(
	   '<p>' + data.shulData[i].id + '</p>'	+
	   '<p>' + data.shulData[i].adminEmail + '</p>'	+
	   '<p>' + data.shulData[i].name + '</p>'	+
	   '<p>' + data.shulData[i].called + '</p>'	+
	   '<p>' + data.shulData[i].address.street + '</p>'	+
	   '<p>' + data.shulData[i].address.city + '</p>'	+
	   '<p>' + data.shulData[i].address.state + '</p>'	+
	   '<p>' + data.shulData[i].address.zip + '</p>'	+
	   '<p>' + data.shulData[i].rabbi + '</p>'	+
	   '<p>' + data.shulData[i].asstRabbi + '</p>' +
		 	'<p>' + data.shulData[i].chazan + '</p>'
	 	 );
	   for (j in data.shulData.board) {
		   $('#shulInfo').append(
	     '<p>' + data.shulData[i].board[j].title + '</p>'	+
	     '<p>' + data.shulData[i].board[j].person + '</p>'
		 	 );}
		 $('#shulInfo').append(
	   '<p>' + data.shulData[i].shabbos.minchaErevShabbos + '</p>'	+
	   '<p>' + data.shulData[i].shabbos.kabolasShabbos + '</p>'	+
	   '<p>' + data.shulData[i].shabbos.shacharis + '</p>'	+
	   '<p>' + data.shulData[i].shabbos.mincha + '</p>'	+
	   '<p>' + data.shulData[i].shabbos.maariv + '</p>'	+
	   '<p>' + data.shulData[i].weekday.shacharis1 + '</p>'	+
	   '<p>' + data.shulData[i].weekday.shacharis2 + '</p>'	+
	   '<p>' + data.shulData[i].weekday.shacharis3 + '</p>'	+
	   '<p>' + data.shulData[i].weekday.mincha + '</p>'	+
	   '<p>' + data.shulData[i].weekday.maariv1 + '</p>'	+
	   '<p>' + data.shulData[i].weekday.maariv2 + '</p>'	+
	   '<p>' + data.shulData[i].sundayLegalHoliday.shacharis1 + '</p>'	+
	   '<p>' + data.shulData[i].sundayLegalHoliday.shacharis2 + '</p>'	+
	   '<p>' + data.shulData[i].notes + '</p>'
	 	 );
	   for (k in data.shulData.events) {
			 $('#shulInfo').append(
	     '<p>' + data.shulData[i].events[k].label + '</p>'	+
	     '<p>' + data.shulData[i].events[k].date + '</p>'	+
	     '<p>' + data.shulData[i].events[k].desc + '</p>'
		 );}
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
