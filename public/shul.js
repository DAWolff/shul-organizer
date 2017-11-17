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
            "sunday and legal holiday": {
              "shacharis1": "7:30 am",
              "shacharis2": "8:30 am"
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
    for (index in data.shulData) {
	   $('#shulInfo').append(
        '<p>' + data.shulData[index].name + '</p>'	+
			 '<p>' + data.shulData[index].called + '</p>'
			);
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
