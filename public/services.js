// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_SERVICES_DATA = {
	"servicesData": [
        {
          "id": "1111111",
          "parsha": "Breishis",
          "dateHebrew": "23 Tishrei, 5718",
          "dateEnglish": "Oct. 3, 2017",
          "kiddush": {
            "made": "t",
            "sponsor": "Yochanan Danziger",
            "pledge": "200",
            "paid": "t"
          },
          "ledDavening": {
            "kabolasShabbos": "Yehuda Metz",
            "shacharis": "Benny Katz",
            "musaf": "Levi Schwartz",
            "mincha": ""
          },
          "aliyosShacharis": {
            "kohen": {
              "member": "Benny Katz",
              "pledge": "18"
            },
            "levi": {
              "member": "Avrohom Levine",
              "pledge": "18"
            },
            "shlishi": {
              "member": "Michoel Greene",
              "pledge": "54"
            },
            "revii": {
              "member": "Ezra Nagar",
              "pledge": "54"
            },
            "chamishi": {
              "member": "Daniel Yarmush",
              "pledge": "54"
            },
            "shishi": {
              "member": "Eli Beren",
              "pledge": "54"
            },
            "shevii": {
              "member": "Moshe Altein",
              "pledge": "54"
            },
            "maftir": {
              "member": "Yochanan Danziger",
              "pledge": "200"
            }
          },
          "aliyosMincha": {
            "kohen": "Aryeh Cohen",
            "levi": "Mendel Gurevitch",
            "shlishi": "Anshel Abeler"
          },
          "notes": "nothing to add"
      },
      {
        "id": "2222222",
        "parsha": "Noach",
        "dateHebrew": "27 Tishrei, 5718",
        "dateEnglish": "Oct. 10, 2017",
        "kiddush": {
          "made": "t",
          "sponsor": "Shul",
          "pledge": "f",
          "paid": ""
        },
        "ledDavening": {
          "kabolasShabbos": "Yitzchok Isaacs",
          "shacharis": "Baruch Hofinger",
          "musaf": "Peretz Mochkin",
          "mincha": ""
        },
        "aliyosShacharis": {
          "kohen": {
            "member": "Toby Sofer",
            "pledge": "10"
          },
          "levi": {
            "member": "Avrohom Levine",
            "pledge": "18"
          },
          "shlishi": {
            "member": "Yehuda Rosen",
            "pledge": "50"
          },
          "revii": {
            "member": "Avrohom Duban",
            "pledge": "26"
          },
          "chamishi": {
            "member": "Naftoli Hirsh",
            "pledge": "54"
          },
          "shishi": {
            "member": "Alon Benjamin",
            "pledge": "10"
          },
          "shevii": {
            "member": "Noach Dear",
            "pledge": "100"
          },
          "maftir": {
            "member": "Zev Herman",
            "pledge": "100"
          }
        },

        "aliyosMincha": {
          "kohen": "Hershel Hofinger",
          "levi": "Zalman Horowitz",
          "shlishi": "Reuvain Brennen"
        },
        "notes": ""
    }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentServicesData(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_SERVICES_DATA)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayServicesData(data) {
    for (index in data.servicesData) {
			 $('#servicesInfo').append(
	        '<p>' + data.servicesData[index].parsha + '</p>'	+
				  '<p>' + data.servicesData[index].dateHebrew + '</p>'
				);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayServicesData() {
	getRecentServicesData(displayServicesData);
}

//  on page load do this
$(function() {
	getAndDisplayServicesData();
})
