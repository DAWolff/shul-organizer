'use strict'
// window.location.href = "../shul-read.html"
var loggedIn = false;
var accessLevel = 0;
var shulID = "";
const query = "";


function watchLoginSubmit() {

  $('#js-login').click(event => {
    event.preventDefault();
    // validate email format
    let email = $( "input[name='email']" ).val().trim();
    if (validateEmail(email)) {
      if ( ! $('#js-email-error').hasClass("hide") )
        $('#js-email-error').addClass("hide");
    }
    else {
      $('#js-email-error').removeClass("hide");
      $('#js-login-container').height("65vh");
      watchCloseError();
      return;
    };
    // validate pw format
    let pw =  $( "input[name='pw']" ).val().trim();
    if (pw && pw.length > 5)
      getLoginCredentials(email, pw);
    else {
      $('#js-pw-error').removeClass("hide");
      $('#js-login-container').height("65vh");
      watchCloseError();
    };
  });
}


function watchCloseError() {

  $('#js-email-error').click(event => {
    event.preventDefault();
    $('#js-email-error').addClass("hide");
  });
  $('#js-pw-error').click(event => {
    event.preventDefault();
    $('#js-pw-error').addClass("hide");
  });
  $('#js-newshul-error').click(event => {
    event.preventDefault();
    $('#js-newshul-error').addClass("hide");
  });
}

function getLoginCredentials(email, pw) {

  accessLevel = 0;
  shulID = "";
  loggedIn = false;
  let route = '/user/' + email + '/pw/' + pw;

  $.getJSON(route, function( user ) {

    if (user.error) {
      if (user.error.type === 'user') {
        $('#js-email-error-txt').text(user.error.msg);
        $('#js-email-error').removeClass("hide");
        $('#js-login-container').height("65vh");
        watchCloseError();
        return;
      }
      if (user.error.type === 'password') {
        $('#js-pw-error-txt').text(user.error.msg);
        $('#js-pw-error').removeClass("hide");
        $('#js-login-container').height("65vh");
        watchCloseError();
        return;
      }
      console.log("Error type: " + user.error.type + " Msg: " + user.error.msg )
      $('#js-email-error-txt').text("Login failed.  Unknown error- notify admin");
      $('#js-email-error').removeClass("hide");
      $('#js-login-container').height("65vh");
      watchCloseError();
      return;
    }

    if (user.schemaType) {
      accessLevel = user.accessLevel;
      shulID = user.shulId;
      loggedIn = true;
      console.log('logged in. access: ' + accessLevel + ' shulID: ' + shulID);

      if (accessLevel <= 1) {
        if (shulID) {
          displayShulData(shulID);
        }
        else {
          let route = '/shul-all-public';
          $.getJSON(route, function( data ) {
              renderShulList(data);
          });
        }
      };

      if (accessLevel === 3) {
        displayShulData(shulID);
      };

      if (accessLevel >= 5) {
        let route = '/shul-all';
        shulID = "";
        $.getJSON(route, function( data ) {
            renderShulList(data);
        });
      };

    };  // user object returned
  })
  .fail(function(err) {
    // responseJSON   status

    console.log(err);
  }
  );  // getJSON call
}


function watchRegisterSubmit() {

  $('#js-register').click(event => {
    event.preventDefault();
    $('#js-login-container').height("73vh");
    var email = "";
    var pw = "";

    // close any validation errors and start over from the top...
    if ( ! $('#js-email-error').hasClass("hide") )
      $('#js-email-error').addClass("hide");
    if ( ! $('#js-pw-error').hasClass("hide") )
      $('#js-pw-error').addClass("hide");
    if ( ! $('#js-newshul-error').hasClass("hide") )
      $('#js-newshul-error').addClass("hide");

    // validate email format
    email = $( "input[name='email']" ).val().trim();
    if ( ! validateEmail(email) ) {
      $('#js-email-error-txt').text("User ID must be valid email format");
      $('#js-email-error').removeClass("hide");
      $('#js-login-container').height("80vh");
      watchCloseError();
      return;
    };

    // validate pw format
    pw =  $( "input[name='pw']" ).val().trim();
    if (pw && pw.length > 5) { }
    else {
      $('#js-pw-error-txt').text("Password is invalid");
      $('#js-pw-error').removeClass("hide");
      $('#js-login-container').height("80vh");
      watchCloseError();
      return;
    };

    // validate (required) Shul fields
    let shulName =  $( "input[name='shulname']" ).val().trim();
    let shulCalled =  $( "input[name='shulcalled']" ).val().trim();
    if (shulName.length > 2 && shulCalled) { }
    else {
      $('#js-newshul-error').removeClass("hide");
      $('#js-login-container').height("80vh");
      watchCloseError();
      return;
    };

    // verify user does not already exist
    let route = '/user/' + email;
    $.getJSON(route, function( response ) {
      if (response.message === "User is not registered") {
        registerNewGabbaiAndShul(email, pw, shulName, shulCalled);
      }
      else {
        if (response.error) {
          if (response.error.type === 'user') {
            $('#js-email-error-txt').text(`${response.error.msg}`);
            $('#js-email-error').removeClass("hide");
            $('#js-login-container').height("80vh");
            watchCloseError();
            return;
          };
        };
      };
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log('getJSON find User failed! ' + textStatus);
      $('#js-email-error-txt').text("getJSON find User failed!");
      $('#js-email-error').removeClass("hide");
      $('#js-login-container').height("80vh");
      watchCloseError();
      return;
    });
  });
}


function registerNewGabbaiAndShul(email, pw, shulName, shulCalled) {

  let route = '/newUserShul';
  let data = { "email": email,
               "pw": pw,
               "name": shulName,
               "called": shulCalled };


  $.post(route, data, function(data,status,xhr) {
    console.log(data);
    console.log(status);
    console.log(xhr);
    // function(data,status,xhr)  [do something if success]
      // data - contains the resulting data from the request
      // status - contains the status of the request
      //     ("success", "notmodified", "error", "timeout", or "parsererror")
      // xhr - contains the XMLHttpRequest object
  }, 'json')
  .fail(function(err) {
    // responseJSON   status

    console.log(err);
  });
}


function watchNewUserClick() {

  //  expand login area to include shul information
  $('#js-new-shul').click(event => {
    event.preventDefault();

    // close any validation errors and start over from the top...
    if ( ! $('#js-email-error').hasClass("hide") )
      $('#js-email-error').addClass("hide");
    if ( ! $('#js-pw-error').hasClass("hide") )
      $('#js-pw-error').addClass("hide");
    if ( ! $('#js-newshul-error').hasClass("hide") )
      $('#js-newshul-error').addClass("hide");

    $( "input[name='email']" ).attr('placeholder', "Gabbai's email");
    $('#js-login-container').height("73vh");
    $('.login').toggleClass( "hide" );
    $('.register').toggleClass( "hide" );
  });
}


function watchNavbarClicks() {

// --- access level will determine results -----
// 0 = not logged in
// 1 = regular member (not a shul gabbai)
// 3 = gabbai of shul
// 5 = site admin

//     CLICKED SHUL ICON
  $('#js-shul-icon').click(event => {
    event.preventDefault();

    if (accessLevel <= 1) {
      let route = '/shul-all-public';
      $.getJSON(route, function( data ) {
          renderShulList(data);
      });
    };

    if (accessLevel === 3) {
      if (shulID)
        displayShulData(shulID);
    };

    if (accessLevel >= 5) {
      let route = '/shul-all';
      $.getJSON(route, function( data ) {
          renderShulList(data);
      });
    };
  });

//     CLICKED MEMBER ICON
  $('#js-member-icon').click(event => {
    event.preventDefault();
    if (accessLevel === 3 || accessLevel >= 5) {
      let route = '/member-all/' + shulID ;
      $.getJSON(route, function( data ) {
          renderMemberList(data);
      });
    };
  });

//     CLICKED SERVICES ICON
  $('#js-services-icon').click(event => {
    event.preventDefault();
    if (accessLevel === 3 || accessLevel >= 5) {
      if (shulID) {
        let route = '/services-all/' + shulID ;
        $.getJSON(route, function( data ) {
            renderServicesList(data);
        });
      }
      else
        console.log("ERROR: Cannot Display Services Without ShulID!");
    };
  });

}


function renderShulList(result) {

  let content = `<h2>Click Shul name for detail</h2>`;
  let shulLine = "";

  result.map(function(oneShul) {
    if (oneShul.called) {
      let street = " ";
      let city = " ";
      let state = " ";
      if (oneShul.address) {
        street = oneShul.address.street;
        city = oneShul.address.city;
        state = oneShul.address.state;
      };
      shulLine = `
              <div class="js-result-field">
                <div class="js-result-button">
                  <input type="submit" value="${oneShul.called}" class="select" data-itemid="${oneShul._id}"/>
                </div>
                <div class="js-result-content">
                 ${oneShul.name} &nbsp ${street} &nbsp ${city}, &nbsp ${state}
                </div>
              </div>
          `
      content = content + shulLine;
    };
  });   // map
  // $('#js-navbar').css( "border-bottom", "3px solid #1c2833" );
  // $('#js-footer').css( "border-top", "3px solid #1c2833" );
  $('#js-results').html(content);
  hideLoginRevealResults();
  $(watchShulselection);
}


function watchShulselection() {

    $( "#js-results" ).on( "click", "input", function( event ) {
      event.preventDefault();
      let element = event.currentTarget;
      shulID = element.dataset.itemid;
      displayShulData(shulID);
    });
}


function displayShulData(shulIdIn) {

  console.log('shul ID: ' + shulIdIn);
  let route = '/shul/' + shulIdIn;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
          // modal - invalid shul ID
          console.log('could not find shulID:' + shulIdIn);
          return;
      };
      if (data.schemaType === 'shul') {
          renderShulData(data);
      };
  });
}


function renderShulData(shul) {

  let content = "";

  let shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Shul Name
              <div class="js-result-content">${shul.called}</div>
            </div>
        </div>   `
  content = content + shulLine

  shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Official Name
              <div class="js-result-content">${shul.name}</div>
            </div>
        </div>   `
  content = content + shulLine

  shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Gabbai email
              <div class="js-result-content">${shul.adminEmail}</div>
            </div>
        </div>   `
  content = content + shulLine

  if (shul.public) {
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Publicly visible?
              <div class="js-result-content">${shul.public}</div>
            </div>
        </div>
        `;
    content = content + shulLine
  };

  if (shul.address) {
    let street = shul.address.street || " ";
    let city = shul.address.city || " ";
    let state = shul.address.state || " ";
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Address
              <div class="js-result-content">${street} &nbsp ${city}, &nbsp ${state}</div>
            </div>
        </div>
        `;
    content = content + shulLine;
  };

  if (shul.rabbi) {
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Rabbi
              <div class="js-result-content">${shul.rabbi}</div>
            </div>
        </div>
        `;
    content = content + shulLine;
  };

  if (shul.asstRabbi) {
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Assistant Rabbi
              <div class="js-result-content">${shul.asstRabbi}</div>
            </div>
        </div>
        `;
    content = content + shulLine;
  };

  if (shul.chazan) {
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Chazan
              <div class="js-result-content">${shul.chazan}</div>
            </div>
        </div>
        `;
    content = content + shulLine;
  };

  if (shul.shabbos) {
    let minchaErevShabbos = " ";
    let kabolasShabbos = " ";
    let shacharis = " ";
    let mincha = " ";
    let maariv = " ";
    if (shul.shabbos.minchaErevShabbos)
      minchaErevShabbos = shul.shabbos.minchaErevShabbos;
    if (shul.shabbos.kabolasShabbos)
      kabolasShabbos = shul.shabbos.kabolasShabbos;
    if (shul.shabbos.shacharis)
      shacharis = shul.shabbos.shacharis;
    if (shul.shabbos.mincha)
      mincha = shul.shabbos.mincha;
    if (shul.shabbos.maariv)
      maariv = shul.shabbos.maariv;
    shulLine = `
        <div class="js-result-field">
          <div class="js-result-label">Shabbos Davening
            <div class="js-result-content">
              <p class="result-sub-label">Mincha Erev Shabbos: &nbsp</p>
              ${minchaErevShabbos}
            </div>
            <div class="js-result-content">
              <p class="result-sub-label">Kabolas Shabbos: &nbsp</p>
                ${kabolasShabbos}
            </div>
            <div class="js-result-content">
              <p class="result-sub-label">Shacharis: &nbsp</p>
                ${shacharis}
            </div>
            <div class="js-result-content">
              <p class="result-sub-label">Mincha: &nbsp</p>
                ${mincha}
            </div>
            <div class="js-result-content">
              <p class="result-sub-label">Maariv Motzei Shabbos: &nbsp</p>
                ${maariv}
            </div>
          </div>
        </div>
        `;
    content = content + shulLine;
  };

  if (shul.weekday) {
    let shacharis1 = "n/a";
    let shacharis2 = "n/a";
    let shacharis3 = "n/a";
    let mincha = "n/a";
    let maariv1 = "n/a";
    let maariv2 = "n/a";
    if (shul.weekday.shacharis1)
      shacharis1 = shul.weekday.shacharis1;
    if (shul.weekday.shacharis2)
      shacharis2 = shul.weekday.shacharis2;
    if (shul.weekday.shacharis3)
      shacharis3 = shul.weekday.shacharis3;
    if (shul.weekday.mincha)
      mincha = shul.weekday.mincha;
    if (shul.weekday.maariv1)
      maariv1 = shul.weekday.maariv1;
    if (shul.weekday.maariv2)
      maariv2 = shul.weekday.maariv2;

    shulLine = `
      <div class="js-result-field">
        <div class="js-result-label">Weekday Davening
          <div class="js-result-content">
            <p class="result-sub-label">First Shacharis: &nbsp</p>
            ${shacharis1}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Second Shacharis: &nbsp</p>
            ${shacharis2}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Third Shacharis: &nbsp</p>
            ${shacharis3}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Mincha: &nbsp</p>
              ${mincha}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">First Maariv: &nbsp</p>
              ${maariv1}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Second Maariv: &nbsp</p>
              ${maariv2}
          </div>
        </div>
      </div>
      `;
    content = content + shulLine;
    };


  if (shul.sundayLegalHoliday) {
    let shacharis1 = "n/a";
    let shacharis2 = "n/a";
    let shacharis3 = "n/a";
    if (shul.sundayLegalHoliday.shacharis1)
      shacharis1 = shul.sundayLegalHoliday.shacharis1;
    if (shul.sundayLegalHoliday.shacharis2)
      shacharis2 = shul.sundayLegalHoliday.shacharis2;
    if (shul.sundayLegalHoliday.shacharis3)
      shacharis3 = shul.sundayLegalHoliday.shacharis3;

    shulLine = `
      <div class="js-result-field">
        <div class="js-result-label">Sunday & Legal Holiday
          <div class="js-result-content">
            <p class="result-sub-label">First Shacharis: &nbsp</p>
            ${shacharis1}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Second Shacharis: &nbsp</p>
            ${shacharis2}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Third Shacharis: &nbsp</p>
            ${shacharis3}
          </div>
        </div>
      </div>
      `;
    content = content + shulLine;
  };

  if (shul.events[0]) {
    let label = "";
    let date = "";
    let desc = "desc";

    content = content + `
      <div class="js-result-field">
        <div class="js-result-label">Shul Events `;

    shul.events.map((shulEvent, index) => {
      shulLine = `
            <div class="js-result-content expand">
              ${shulEvent.label} <br>
              ${shulEvent.date} <br>
              ${shulEvent.desc}
            </div> `;
    content = content + shulLine;
    });
    content = content + `</div>  </div>   `;
  };

  if (shul.board[0]) {
    let title = "";
    let person = "";

    content = content + `
      <div class="js-result-field">
        <div class="js-result-label">Shul Board `;

    shul.board.map((boardMember, index) => {
      title = boardMember.title;
      person = boardMember.person;
      shulLine = `
            <div class="js-result-content">
              <p class="result-sub-label">${title}: &nbsp</p>
              ${person}
            </div>
            `;
      content = content + shulLine;
    });

    content = content + `</div>  </div>   `;
  };

  if (shul.notes)  {
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Notes
              <div class="js-result-content expand">${shul.notes}</div>
            </div>
        </div>   `;
    content = content + shulLine;
    };

  $('#js-results').html(content);
  hideLoginRevealResults();
}


function renderMemberList(result) {

  let content = `<h2>Click Member name for detail</h2>`;
  let memberLine = "";

  result.map(function(oneMember) {
    if (oneMember.shulId) {

      let cell = " ";
      if (oneMember.contactInfo.cellPhone)
        cell = formatPhone(oneMember.contactInfo.cellPhone);

      let email = oneMember.contactInfo.eMail || " ";

      memberLine = `
              <div class="js-result-field">
                <div class="js-result-button">
                  <input type="submit" value="${oneMember.called}" class="select" data-itemid="${oneMember._id}"/>
                </div>
                <div class="js-result-content expand">
                 ${oneMember.englishName} &nbsp ${oneMember.familyName} <br>
                 ${oneMember.hebrewNameFull} &nbsp ${email} &nbsp ${cell}
                </div>
              </div>
          `;
      content = content + memberLine;
    };

  });   // map

  $('#js-results').html(content);
  hideLoginRevealResults();
  $(watchMemberSelection);
}


function watchMemberSelection() {

    $( "#js-results" ).on( "click", "input", function( event ) {
      event.preventDefault();
      let element = event.currentTarget;
      let memberID = element.dataset.itemid;
      displayMemberData(memberID);
    });
}


function displayMemberData(memberID) {

  console.log('member ID: ' + memberID);
  let route = '/member/' + memberID;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
          // modal - invalid member ID
          console.log('could not find memberID:' + memberID);
          return;
      };
      if (data.schemaType === 'member') {
          renderMemberData(data);
      };
  });
}


function renderMemberData(member) {

  if (member.schemaType != 'member') {
      console.log("error in renderMemberData-invalid paramemter passed in.");
      return;
  }

  let content = "";

  let prefix = member.title || "";
  let suffix = "";
  if (member.kohen)  suffix = "HaKohen";
  if (member.levi)   suffix = "HaLevi";

  let memberLine = `
      <div class="js-result-field">
        <div class="js-result-label">Member
          <div class="js-result-content">
            <p class="result-sub-label">Called: &nbsp</p>
            ${prefix} &nbsp ${member.called}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Hebrew Name: &nbsp</p>
            ${member.hebrewNameFull} &nbsp ${suffix}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">English Name: &nbsp</p>
            ${member.englishName} &nbsp  ${member.familyName}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Regular?: &nbsp</p>
            ${member.regular}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">Can Lead Davening?: &nbsp</p>
            ${member.canLeadDavening}
          </div>
        </div>
      </div>
      `;
  content = content + memberLine;

  if (member.contactInfo) {
    let street = member.contactInfo.homeAddress.street || " ";
    let city = member.contactInfo.homeAddress.city || " ";
    let state = member.contactInfo.homeAddress.state || " ";
    let zip = member.contactInfo.homeAddress.zip || " ";
    let notes = member.contactInfo.homeAddress.addrNotes || " ";

    let cell = " ";
    if (member.contactInfo.cellPhone)
      cell = formatPhone(member.contactInfo.cellPhone);

    memberLine = `
        <div class="js-result-field">
          <div class="js-result-label">Contact Info
            <div class="js-result-content">
              <p class="result-sub-label">Email: &nbsp</p>
              ${member.contactInfo.eMail}
            </div>
            <div class="js-result-content">
              <p class="result-sub-label">Cell: &nbsp</p>
              ${cell}
            </div>
            <div class="js-result-content">
              ${street} &nbsp ${city}, &nbsp ${state} &nbsp ${zip}
            </div>
            <div class="js-result-content">
              <p class="result-sub-label">Notes: &nbsp</p>
              ${notes}
            </div>
          </div>
        </div>
        `;
    content = content + memberLine;
  };

  if (member.fatherHebrewName || member.motherHebrewName)  {
    memberLine = `
        <div class="js-result-field">
            <div class="js-result-label">Parent's Names
              <div class="js-result-content">
                <p class="result-sub-label">Father's Name: &nbsp</p>
                ${member.fatherHebrewName}
              </div>
              <div class="js-result-content">
                <p class="result-sub-label">Mother's Name: &nbsp</p>
                ${member.motherHebrewName}
              </div>
            </div>
        </div>
        `;
    content = content + memberLine;
  };

  if (member.occaisions[0]) {
    let name = "";
    let day = "";
    let month = "";

    content = content + `
      <div class="js-result-field">
        <div class="js-result-label">Member Occaisions`;

    member.occaisions.map((memberOccaision, index) => {
      memberLine = `
            <div class="js-result-content expand">
              ${memberOccaision.name} <br>
              ${memberOccaision.day} &nbsp ${memberOccaision.month}
            </div>
            `;
    content = content + memberLine;
    });

    content = content + `</div>  </div> `;
  };

  if (member.lastAliya) {
    memberLine = `
      <div class="js-result-field">
        <div class="js-result-label">Last Aliya
            <div class="js-result-content">
              ${member.lastAliya.aliya} &nbsp ${member.lastAliya.parsha}, &nbsp ${member.lastAliya.year}
            </div>
        </div>
      </div>
      `;
    content = content + memberLine;
  };

  if (member.lastLedDavening) {
    memberLine = `
      <div class="js-result-field">
        <div class="js-result-label">Last Led Davening
            <div class="js-result-content">
              ${member.lastLedDavening.tefilla} &nbsp ${member.lastLedDavening.parsha}, &nbsp ${member.lastLedDavening.year}
            </div>
        </div>
      </div>
      `;
    content = content + memberLine;
  };

  if (member.notes)  {
    memberLine = `
        <div class="js-result-field">
            <div class="js-result-label">Notes
              <div class="js-result-content expand">${member.notes}</div>
            </div>
        </div>
        `;
    content = content + memberLine;
  };

  $('#js-results').html(content);
  hideLoginRevealResults();
}


function renderServicesList(result) {

  let content = `<h2>Click Services date for detail</h2>`;
  let servicesLine = "";

  result.map(function(oneService) {
    if (oneService.shulId) {

      let when = oneService.when.parsha + " " + oneService.when.year;
      let date = new Date(oneService.dateEnglish);
      let formattedDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
      let kohen = oneService.aliyosShacharis.kohen.member || " ";
      let levi = oneService.aliyosShacharis.levi.member || " ";
      let shlishi = oneService.aliyosShacharis.shlishi.member || " ";
      let revii = oneService.aliyosShacharis.revii.member || " ";
      let chamishi = oneService.aliyosShacharis.chamishi.member || " ";
      let shishi = oneService.aliyosShacharis.shishi.member || " ";
      let shevii = oneService.aliyosShacharis.shevii.member || " ";
      let maftir = oneService.aliyosShacharis.maftir.member || " ";

      servicesLine = `
              <div class="js-result-field">
                <div class="js-result-button">
                  <input type="submit" value="${when}" class="select" data-itemid="${oneService._id}"/>
                </div>
                <div class="js-result-content expand">
                 ${oneService.dateHebrew} &nbsp ${formattedDate} <br>
                 <p class="result-sub-label">Kohen: &nbsp</p>${kohen} &nbsp &nbsp
                 <p class="result-sub-label">Levi: &nbsp</p>${levi} &nbsp &nbsp
                 <p class="result-sub-label">Shlishi: &nbsp</p>${shlishi} <br>
                 <p class="result-sub-label">Revii: &nbsp</p>${revii} &nbsp &nbsp
                 <p class="result-sub-label">Chamishi: &nbsp</p>${chamishi} &nbsp &nbsp
                 <p class="result-sub-label">Shishi: &nbsp</p>${shishi} <br>
                 <p class="result-sub-label">Shevii: &nbsp</p>${shevii} &nbsp &nbsp
                 <p class="result-sub-label">Maftir: &nbsp</p>${maftir}
                </div>
              </div>
          `;
      content = content + servicesLine;
    };
  });   // map

  $('#js-results').html(content);
  hideLoginRevealResults();
  $(watchServicesSelection);
}


function watchServicesSelection() {

  $( "#js-results" ).on( "click", "input", function( event ) {
    event.preventDefault();
    let element = event.currentTarget;
    let servicesID = element.dataset.itemid;
    displayServicesData(servicesID);
  });
}


function displayServicesData(servicesID) {

  console.log('services ID: ' + servicesID);
  let route = '/services/' + servicesID;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
          // modal - invalid services ID
          console.log('could not find servicesID:' + servicesID);
          return;
      };
      if (data.schemaType === 'services') {
          renderServicesData(data);
      };
  });
}


function renderServicesData(services) {

  if (services.schemaType != 'services') {
      console.log("error in renderServicesData--invalid object passed in.");
      return;
  };

  let when = services.when.parsha + " " + services.when.year;
  let date = new Date(services.dateEnglish);
  let formattedDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

  let kabolasShabbos = services.ledDavening.kabolasShabbos || " ";
  let shacharis = services.ledDavening.shacharis || " ";
  let musaf = services.ledDavening.musaf || " ";
  let mincha = services.ledDavening.mincha || " ";

  let kohen = services.aliyosShacharis.kohen.member || " ";
  let levi = services.aliyosShacharis.levi.member || " ";
  let shlishi = services.aliyosShacharis.shlishi.member || " ";
  let revii = services.aliyosShacharis.revii.member || " ";
  let chamishi = services.aliyosShacharis.chamishi.member || " ";
  let shishi = services.aliyosShacharis.shishi.member || " ";
  let shevii = services.aliyosShacharis.shevii.member || " ";
  let maftir = services.aliyosShacharis.maftir.member || " ";

  let content = "";

  let servicesLine = `
      <div class="js-result-field">
        <div class="js-result-label">${when}
          <div class="js-result-content">
            <p class="result-sub-label">Hebrew Date: &nbsp</p>
             ${services.dateHebrew}
          </div>
          <div class="js-result-content">
            <p class="result-sub-label">English Date: &nbsp</p>
             ${formattedDate}
          </div>
        </div>
      </div>
      `;
  content = content + servicesLine;

  if (services.ledDavening) {
    servicesLine = `
        <div class="js-result-field">
          <div class="js-result-label">Led Davening
            <div class="js-result-content expand">
             <p class="result-sub-label">Kabolas Shabbos: &nbsp</p>${kabolasShabbos} <br>
             <p class="result-sub-label">Shacharis: &nbsp</p>${shacharis} &nbsp &nbsp
             <p class="result-sub-label">Musaf: &nbsp</p>${musaf}    <br>
             <p class="result-sub-label">Mincha: &nbsp</p>${mincha}
            </div>
          </div>
        </div>
        `;
    content = content + servicesLine;
  };

  if (services.aliyosShacharis) {
    servicesLine = `
        <div class="js-result-field">
          <div class="js-result-label">Shacharis Aliyos
            <div class="js-result-content expand">
             <p class="result-sub-label">Kohen: &nbsp</p>${kohen} &nbsp &nbsp
             <p class="result-sub-label">Levi: &nbsp</p>${levi}       <br>
             <p class="result-sub-label">Shlishi: &nbsp</p>${shlishi} &nbsp &nbsp
             <p class="result-sub-label">Revii: &nbsp</p>${revii}     <br>
             <p class="result-sub-label">Chamishi: &nbsp</p>${chamishi} &nbsp &nbsp
             <p class="result-sub-label">Shishi: &nbsp</p>${shishi}   <br>
             <p class="result-sub-label">Shevii: &nbsp</p>${shevii} &nbsp &nbsp
             <p class="result-sub-label">Maftir: &nbsp</p>${maftir}
            </div>
          </div>
        </div>
        `;
    content = content + servicesLine;
  };

  if (services.aliyosMincha) {
    servicesLine = `
        <div class="js-result-field">
          <div class="js-result-label">Mincha Aliyos
            <div class="js-result-content expand">
             <p class="result-sub-label">Kohen: &nbsp</p>${services.aliyosMincha.kohen} &nbsp &nbsp
             <p class="result-sub-label">Levi: &nbsp</p>${services.aliyosMincha.levi} <br>
             <p class="result-sub-label">Shlishi: &nbsp</p>${services.aliyosMincha.shlishi}
            </div>
          </div>
        </div>
        `;
    content = content + servicesLine;
  };

  if (services.kiddush) {
    servicesLine = `
        <div class="js-result-field">
          <div class="js-result-label">Kiddush
            <div class="js-result-content expand">
             <p class="result-sub-label">Kiddush?: &nbsp</p>${services.kiddush.made} &nbsp &nbsp
             <p class="result-sub-label">Sponsor: &nbsp</p>${services.kiddush.sponsor} <br>
             <p class="result-sub-label">Pledge: &nbsp</p>${services.kiddush.pledge} &nbsp &nbsp
             <p class="result-sub-label">Paid: &nbsp</p>${services.kiddush.paid}
            </div>
          </div>
        </div>
        `;
    content = content + servicesLine;
  };

  if (services.speaker) {
    servicesLine = `
        <div class="js-result-field">
          <div class="js-result-label">speaker
            <div class="js-result-content">
                ${services.speaker}
            </div>
          </div>
        </div>
        `;
    content = content + servicesLine;
  };

  if (services.notes)  {
    servicesLine = `
        <div class="js-result-field">
            <div class="js-result-label">Notes
              <div class="js-result-content expand">${services.notes}</div>
            </div>
        </div>
        `;
    content = content + servicesLine;
  };
  $('#js-results').html(content);
  hideLoginRevealResults();
}


function formatPhone(input) {
        input = input.toString();
        // Strip all characters from the input except digits
        input = input.replace(/\D/g,'');
        // Trim the remaining input to ten characters, to preserve phone number format
        input = input.substring(0,10);
        // Based upon the length of the string, we add formatting as necessary
        var size = input.length;
        if(size == 0){
                input = input;
        }else if(size < 4){
                input = '('+input;
        }else if(size < 7){
                input = '('+input.substring(0,3)+') '+input.substring(3,6);
        }else{
                input = '('+input.substring(0,3)+') '+input.substring(3,6)+'-'+input.substring(6,10);
        }
        return input;
}


function hideLoginRevealResults() {
  if ( ! $('#js-login-row').hasClass("hide") ) {
    $('#js-login-row').addClass("hide");
  };

  if ( $('#js-results').hasClass("hide") ) {
    $('#js-results').removeClass("hide");
  };
}

function validateEmail(mail) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  { return (true) };
return (false);
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

//
// if (storageAvailable('sessionStorage')) {
//   // Yippee! We can use sessionStorage awesomeness
// 	sessionStorage.setItem('myCat', 'Tom');
//   // The syntax for reading the sessionStorage item is as follows:
//   var cat = sessionStorage.getItem("myCat");
//   console.log(cat);
//   // The syntax for removing the sessionStorage item is as follows:
//   sessionStorage.removeItem("myCat");
// }
// else {
//   // Too bad, no sessionStorage for us
// }


$(watchLoginSubmit);
$(watchNewUserClick);
$(watchRegisterSubmit);
$(watchNavbarClicks);
