// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_MEMBER_DATA = {
	"memberData": [
    {
      "id": "1111111",
			"shulId": "1111111",
      "familyName": "Metz",
      "hebrewNameFull": "Yehuda Bentzion",
      "englishName": "Jerry",
      "called": "Yehuda Metz",
      "regular": "t",
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
      "title": "Dr.",
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
         "day": "10"
       },
       { "name": "yortzeit Father",
         "month": "Teves",
         "day": "19"
       },
       { "name": "yortzeit Mother",
         "month": "Av",
         "day": "23"
       },
       { "name": "yortzeit bubby Ester bas Yaakov",
         "month": "Av",
         "day": "10"
       },
       { "name": "wedding anniversary",
         "month": "Tammuz",
         "day": "10"
       }
		 ],
      "notes": "not anything really."
    },
    {
      "id": "2222222",
			"shulId": "1111111",
      "familyName": "Katz",
      "hebrewNameFull": "Binyomin Eliezer Lipa",
      "englishName": "Benjamin",
      "called": "Benny Katz",
      "regular": "t",
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
      "title": "Rabbi",
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
         "day": "5" 
       },
       { "name": "yortzeit zeidy Koppel Gneivish ben Aharon",
         "month": "Elul",
         "day": "14"
       },
       { "name": "wedding anniversary",
         "month": "Elul",
         "day": "7"
       }
		 ],
      "notes": "something something else"
    },
    {
      "id": "3333333",
			"shulId": "1111111",
      "familyName": "Levine",
      "hebrewNameFull": "Avrohom",
      "englishName": "Abraham",
      "called": "Avrohom Levine",
      "regular": "t",
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
      "title": "Shul President",
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
         "day": "29"
       },
       { "name": "yortzeit Father",
         "month": "Cheshvan",
         "day": "20"
       },
       { "name": "wedding anniversary",
         "month": "Kislev",
         "day": "4"
       }
		 ],
      "notes": "something something"
    }
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

	// for (i in data.memberData) {
	var i = 1;
	while (i == 1) {
		 ++i;
		 console.log(data.memberData[i].id);

		 document.memberForm.called.value = data.memberData[i].called;
		 document.memberForm.hebName.value = data.memberData[i].hebrewNameFull;

		 if (data.memberData[i].kohen == "t")
				// 	$('#kl').value = 'kohen';
				// document.memberForm.kohen.value = "kohen";
				$('#kl').append( `
					<span>is a Kohen </span>
				`);
		 if (data.memberData[i].levi == "t")
		 		$('#kl').append( `
			 		<span>is a Levi </span>
		 		`);
		 if (data.memberData[i].regular == "t")
				$('#regular').append( `
					<span> (shul regular)</span>
				`);

		 document.memberForm.father.value = data.memberData[i].fatherHebrewName;
		 document.memberForm.mother.value = data.memberData[i].motherHebrewName;

		 document.memberForm.title.value = data.memberData[i].title;
		 document.memberForm.english.value = data.memberData[i].englishName;
		 document.memberForm.family.value = data.memberData[i].familyName;

		 document.memberForm.email.value = data.memberData[i].contactInfo.eMail;
		 document.memberForm.cell.value = data.memberData[i].contactInfo.cellPhone;
		 document.memberForm.street.value = data.memberData[i].contactInfo.homeAddress.street;
		 document.memberForm.city.value = data.memberData[i].contactInfo.homeAddress.city;
		 document.memberForm.state.value = data.memberData[i].contactInfo.homeAddress.state;
		 document.memberForm.zip.value = data.memberData[i].contactInfo.homeAddress.zip;
		 document.memberForm.addrNotes.value = data.memberData[i].contactInfo.homeAddress.addrNotes;

		//  document.memberForm.aParsha.value = data.memberData[i].lastAliya.parsha;
		//  document.memberForm.aYear.value = data.memberData[i].lastAliya.year;
		//  document.memberForm.aTefilla.value = data.memberData[i].lastAliya.aliya;
		 let lastAl = data.memberData[i].lastAliya.year + ' ' +
		 							data.memberData[i].lastAliya.parsha + ', ' +
		 						  data.memberData[i].lastAliya.aliya;

		 		 $('#lastAliya').append( `
		 			<span>${lastAl}</span><br>
		 		 `);

		 document.memberForm.canLead.value = data.memberData[i].canLeadDavening;
		//  document.memberForm.lParsha.value = data.memberData[i].lastLedDavening.parsha;
		//  document.memberForm.lYear.value = data.memberData[i].lastLedDavening.year;
		//  document.memberForm.lTefilla.value = data.memberData[i].lastLedDavening.tefilla;
		 let lastLd = data.memberData[i].lastLedDavening.year + ' ' +
								  data.memberData[i].lastLedDavening.parsha + ', ' +
								  data.memberData[i].lastLedDavening.tefilla;

		 $('#lastLed').append( `
			<span>${lastLd}</span><br>
		 `);

		 for (var j = 0; j < data.memberData[i].occaisions.length; j++) {
			let occaision = data.memberData[i].occaisions[j].name + '\r\n' +
											data.memberData[i].occaisions[j].day + ' ' +
											data.memberData[i].occaisions[j].month;

			$('#occaisions').append( `
				<textarea wrap="hard" rows="2">${occaision}</textarea><br>
			`);
		 }
	 	 document.memberForm.notes.value = data.memberData[i].notes;
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
