// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_SERVICES_DATA = {
	"servicesData": [
        {
          "id": "1111111",
				  "shulId": "1111111",
          "parsha": "Breishis",
          "dateHebrew": "23 Tishrei, 5718",
          "dateEnglish": "Oct. 3, 2017",
          "kiddush": {
            "made": "t",
            "sponsor": "Yochanan Danziger",
            "pledge": "200",
            "paid": "t"
          },
					"speaker": "Yehuda Metz",
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
				"shulId": "1111111",
        "parsha": "Noach",
        "dateHebrew": "27 Tishrei, 5718",
        "dateEnglish": "Oct. 10, 2017",
        "kiddush": {
          "made": "t",
          "sponsor": "Shul",
          "pledge": "f",
          "paid": ""
        },
				"speaker": "Chaim Sanzer",
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
        "notes": "nada"
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
		// for (i in data.servicesData) {
		var i = 0;
		while (i == 0) {
			 ++i;
			 console.log(data.servicesData[i].id);

			 document.servicesForm.parsha.value = data.servicesData[i].parsha;
			 document.servicesForm.hebDate.value = data.servicesData[i].dateHebrew;
			 document.servicesForm.engDate.value = data.servicesData[i].dateEnglish;
 			 document.servicesForm.speaker.value = data.servicesData[i].speaker;

			 document.servicesForm.ledKabShabb.value = data.servicesData[i].ledDavening.kabolasShabbos;
			 document.servicesForm.ledShacharis.value = data.servicesData[i].ledDavening.shacharis;
			 document.servicesForm.ledMusaf.value = data.servicesData[i].ledDavening.musaf;
			 document.servicesForm.ledMincha.value = data.servicesData[i].ledDavening.mincha;

			 document.servicesForm.shaKohen.value = data.servicesData[i].aliyosShacharis.kohen.member;			 document.servicesForm.kohenPledge.value = data.servicesData[i].aliyosShacharis.kohen.pledge;
			 document.servicesForm.shaLevi.value = data.servicesData[i].aliyosShacharis.levi.member;
			 document.servicesForm.leviPledge.value = data.servicesData[i].aliyosShacharis.levi.pledge;
			 document.servicesForm.sha3.value = data.servicesData[i].aliyosShacharis.shlishi.member;
			 document.servicesForm.pledge3.value = data.servicesData[i].aliyosShacharis.shlishi.pledge;
			 document.servicesForm.sha4.value = data.servicesData[i].aliyosShacharis.revii.member;
			 document.servicesForm.pledge4.value = data.servicesData[i].aliyosShacharis.revii.pledge;
			 document.servicesForm.sha5.value = data.servicesData[i].aliyosShacharis.chamishi.member;			 document.servicesForm.pledge5.value = data.servicesData[i].aliyosShacharis.chamishi.pledge;
			 document.servicesForm.sha6.value = data.servicesData[i].aliyosShacharis.shishi.member;
			 document.servicesForm.pledge6.value = data.servicesData[i].aliyosShacharis.shishi.pledge;
			 document.servicesForm.sha7.value = data.servicesData[i].aliyosShacharis.shevii.member;
			 document.servicesForm.pledge7.value = data.servicesData[i].aliyosShacharis.shevii.pledge;
			 document.servicesForm.shaMaftir.value = data.servicesData[i].aliyosShacharis.maftir.member;
			 document.servicesForm.maftirPledge.value = data.servicesData[i].aliyosShacharis.maftir.pledge;

			 document.servicesForm.minchaKohen.value = data.servicesData[i].aliyosMincha.kohen;
			 document.servicesForm.minchaLevi.value = data.servicesData[i].aliyosMincha.levi;
			 document.servicesForm.minchaShlishi.value = data.servicesData[i].aliyosMincha.shlishi;

			 document.servicesForm.kiddushMade.value = data.servicesData[i].kiddush.made;
			 document.servicesForm.kiddushSponsor.value = data.servicesData[i].kiddush.sponsor;
			 document.servicesForm.kiddushPledge.value = data.servicesData[i].kiddush.pledge;
			 document.servicesForm.pledgePaid.value = data.servicesData[i].kiddush.paid;

		 	 document.servicesForm.notes.value = data.servicesData[i].notes;
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
