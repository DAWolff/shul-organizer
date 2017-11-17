// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_MEMBER_DATA = {
	"memberData": [
    {
      "id": "1111111",
      "familyName": "Metz",
      "hebrewNameFull": "Yehuda Bentzion",
      "englishName": "Jerry",
      "called": "Yehuda Metz",
      "regular": "y",
      "contactInfo": {
        "eMail": "ymetz@gmaiil.com",
        "cellPhone": "6462489372",
        "homeAddress": {
          "street": "1241 President St.",
          "city": "Brooklyn",
          "state": "NY",
          "zip": "11213",
          "addrNotes": "use side door"
        }
      },
      "fatherHebrewName": "Eliezer ben Volf",
      "motherHebrewName": "Miriam bas Feivel",
      "titles": "Dr.",
      "kohen": "f",
      "levi": "f",
      "lastAliya": {
        "parsha": "Yom Kippur",
        "year": "2017",
        "aliya": "revii"
      },
      "canLeadDavening": "t",
      "lastLedDavening": {
        "parsha": "Noach",
        "year": "2017",
        "tefilla": "musaf"
      },
      "occaisions": [
       { "name": "Jewish Birthday",
         "month": "Shevat",
         "day": "10",
       },
       { "name": "yortzeit Father",
         "month": "Teves",
         "day": "19",
       },
       { "name": "yortzeit Mother",
         "month": "Av",
         "day": "23",
       },
       { "name": "yortzeit bubby Ester bas Yaakov",
         "month": "Av",
         "day": "10"
       },
       { "name": "wedding anniversary",
         "month": "Tammuz",
         "day": "10"
       },
		 ],
      "notes": ""
    },
    {
      "id": "2222222",
      "familyName": "Katz",
      "hebrewNameFull": "Binyomin Eliezer Lipa",
      "englishName": "Benjamin",
      "called": "Benny Katz",
      "regular": "y",
      "contactInfo": {
        "eMail": "bennyk@gmaiil.com",
        "cellPhone": "6462879377",
        "homeAddress": {
          "street": "23 Balfour Pl.",
          "city": "Brooklyn",
          "state": "NY",
          "zip": "11215",
          "addrNotes": "first floor"
        }
      },
      "fatherHebrewName": "Alter ben Nosson",
      "motherHebrewName": "Aliza bas Koppel Gneivish",
      "titles": "",
      "kohen": "t",
      "levi": "f",
      "lastAliya": {
        "parsha": "Bereishis",
        "year": "2017",
        "aliya": "kohen"
      },
      "canLeadDavening": "t",
      "lastLedDavening": {
        "parsha": "Bereshis",
        "year": "2017",
        "tefilla": "shacharis"
      },
      "occaisions": [
       { "name": "Jewish Birthday",
         "month": "Iyyar",
         "day": "5",
       },
       { "name": "yortzeit zeidy Koppel Gneivish ben Aharon",
         "month": "Elul",
         "day": "14"
       },
       { "name": "wedding anniversary",
         "month": "Elul",
         "day": "7"
       },
		 ],
      "notes": ""
    },
    {
      "id": "3333333",
      "familyName": "Levine",
      "hebrewNameFull": "Avrohom",
      "englishName": "Abraham",
      "called": "Avrohom Levine",
      "regular": "y",
      "contactInfo": {
        "eMail": "al613@gmaiil.com",
        "cellPhone": "7186746474",
        "homeAddress": {
          "street": "4454 Albany Ave.",
          "city": "Brooklyn",
          "state": "NY",
          "zip": "11213",
          "addrNotes": "Apt. 203"
        }
      },
      "fatherHebrewName": "Gershon Zev ben Mendel Yitzchok",
      "motherHebrewName": "Dina bas Tzvi Hersh",
      "titles": "President of Shul",
      "kohen": "f",
      "levi": "t",
      "lastAliya": {
        "parsha": "Noach",
        "year": "2017",
        "aliya": "levi"
      },
      "canLeadDavening": "t",
      "lastLedDavening": {
        "parsha": "Noach",
        "year": "2017",
        "tefilla": "shacharis"
      },
      "occaisions": [
       { "name": "Jewish Birthday",
         "month": "Sivan",
         "day": "29",
       },
       { "name": "yortzeit Father",
         "month": "Cheshvan",
         "day": "20",
       },
       { "name": "wedding anniversary",
         "month": "Kislev",
         "day": "4"
       },
		 ],
      "notes": ""
    },
  ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getAllMembers(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_MEMBER_DATA)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayAllMembers(data) {
    for (index in data.memberData) {
			$('#membersInfo').append(
         '<p>' + data.memberData[index].called + '</p>'	+
 			 '<p>' + data.memberData[index].fatherHebrewName + '</p>'
 			);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayAllMembers() {
	getAllMembers(displayAllMembers);
}

//  on page load do this
$(function() {
	getAndDisplayAllMembers();
})
