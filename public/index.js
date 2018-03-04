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
  "action": "",
	"target": ""
};

function getLocalStorage() {

  if (storageAvailable('sessionStorage')) {
    let data = sessionStorage.getItem("local_storage");
    console.log(data);
    if (data) {
      storage_data = JSON.parse(data);

      if ( storage_data.logged_in ) {

        switch (storage_data.target) {

          case 'shul':
            if (storage_data.action === "display"  &&  storage_data.shul_id) {
              displayShulData(storage_data.shul_id);
            } else {
              if (storage_data.action === "display-all") {
                let route = '/shul-all';
                getShulData (route);
              }
            };
            break;

          case 'member':
            if (storage_data.action === "display" && storage_data.member_id) {
              displayMemberData(storage_data.member_id);
            } else {
              if (storage_data.action === "display-all") {
                let route = '/member-all/' + storage_data.shul_id;
                $.getJSON(route, function( data ) {
                    renderMemberList(data);
                });
              }
            };
            break;

          case 'services':
            if (storage_data.action === "display") {
              displayServicesData(storage_data.services_id)
            } else {
              if (storage_data.action === "display-all") {
                let route = '/services-all/' + storage_data.shul_id ;
                $.getJSON(route, function( data ) {
                    renderServicesList(data);
                });
              }
            };
            break;

          default:
            console.log("Invalid action code in Local Storage: " + storage_data.target);
        };   // switch

      }  // logged-in

    } else {  // not logged in, reset local storage to blank
      setLocalStorage();
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



function watchLoginSubmit() {

  $('#js-login').click(event => {
    event.preventDefault();
    // validate email format
    let email = $( "input[name='email']" ).val().trim();
    if (validateEmail(email)) {
      if ( ! $('#js-email-error').hasClass("hide") )
        $('#js-email-error').addClass("hide");
    } else {
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

  let route = '/user-login/';
  let data = { "emailIn": email, "pwIn": pw };

  $.ajax({
    url: route,
    method: "POST",
    processData: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json" })
    .done (function( user ) {
      console.log(user);
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
      };

      if (user.schemaType) {
        storage_data.user_email = user.email;
        storage_data.access_level = user.accessLevel;
        storage_data.logged_in = true;
        storage_data.user_id = user.id;
        storage_data.shul_id = user.shulId;
        setLocalStorage();

        if (storage_data.access_level <= 1) {
          if (storage_data.shul_id) {
            displayShulData(storage_data.shul_id);
          } else {
            let route = '/shul-all-public';
            getShulData (route);
          };
        };

        if (storage_data.access_level === 3  &&  storage_data.shul_id) {
          displayShulData(storage_data.shul_id);
        };

        if (storage_data.access_level >= 5) {
          storage_data.shul_id = "";
          let route = '/shul-all';
          getShulData (route);
        };

      };  // user object returned
    })
  .fail(function(err) {
    // responseJSON   status
    console.log(err);
  });
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
    storage_data.shul_name = shulName;

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
      } else {
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
  let body = { "email": email,
               "pw": pw,
               "name": shulName,
               "called": shulCalled };

  $.post(route, body, function ( data, status, xhr ) {
      console.log(data.userId + " "
                + data.email + " "
                + data.accessLevel + " "
                + data.shulId + " "
                + data.shulName )
      storage_data.user_email = data.email;
      storage_data.access_level = data.accessLevel;
      storage_data.logged_in = true;
      storage_data.user_id = data.userId;
      storage_data.shul_id = data.shulId;
      storage_data.shul_name = data.shulName;
      storage_data.action = "update";
      storage_data.target = "shul";
      setLocalStorage();
      window.location.href = "shul-steps.html";
      })
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

    if (storage_data.access_level <= 1) {
      let route = '/shul-all-public';
      getShulData (route);
    };

    if (storage_data.access_level === 3) {
      if (storage_data.shul_id)
        displayShulData(storage_data.shul_id);
    };

    if (storage_data.access_level >= 5) {
      if (storage_data.shul_id) {
        storage_data.action = "update";
        storage_data.target = "shul";
        setLocalStorage();
        window.location.href = "shul-steps.html";
      } else {
        let route = '/shul-all';
        getShulData (route);
      };
    };
  });

//     CLICKED SHUL UPDATE ICON
  $('#js-shovel-icon').click(event => {
    event.preventDefault();

    if (storage_data.access_level <= 1) {
      return;
    };

    if (storage_data.access_level === 3) {
      if (storage_data.shul_id) {
        storage_data.action = "update";
        storage_data.target = "shul";
        setLocalStorage();
        window.location.href = "shul-steps.html";
      };
    };

    if (storage_data.access_level >= 5) {
      if (storage_data.shul_id) {
        storage_data.action = "update";
        storage_data.target = "shul";
        setLocalStorage();
        window.location.href = "shul-steps.html";
      } else {
        let route = '/shul-all';
        getShulData (route);
      };
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

//     CLICKED MEMBER UPDATE ICON
  $('#js-member-upd-icon').click(event => {
    event.preventDefault();
    if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
        storage_data.action = "update";
        storage_data.target = "member";
        setLocalStorage();
        window.location.href = "member-steps.html";
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

//     CLICKED SERVICES UPD ICON
  $('#js-services-upd-icon').click(event => {
    event.preventDefault();
    if (storage_data.access_level === 3 || storage_data.access_level >= 5) {
        storage_data.action = "update";
        storage_data.target = "services";
        setLocalStorage();
        window.location.href = "services-steps.html";
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
              <input type="submit" value="${oneShul.called}" class="select" data-oneshulid="${oneShul._id}"/>
            </div>
            <div class="js-result-content">
             ${oneShul.name} &nbsp ${street} &nbsp ${city}, &nbsp ${state}
            </div>
          </div>
          `
      content = content + shulLine;
    };
  });   // map

  $('#js-shul-results').html(content);
  hideLoginRevealResults("shul");
  $(watchShulSelection);
}


function watchShulSelection() {

    $( "#js-shul-results" ).on( "click", "input", function( event ) {
      event.preventDefault();
      let element = event.currentTarget;
      storage_data.shul_id = element.dataset.oneshulid;
      // reset member_id and services_id information
      storage_data.member_id = "";
      storage_data.services_id = "";
      if (storage_data.shul_id)
        displayShulData(storage_data.shul_id);
    });
}


function getShulData (route) {

  $.getJSON(route, function( data ) {
      renderShulList(data);
  });
}


function displayShulData(shulIdIn) {

  console.log('shul ID: ' + shulIdIn);

  let route = '/shul/' + shulIdIn;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
          console.log('could not find shulID:' + shulIdIn);
          return;
      };
      if (data.schemaType === 'shul') {
          renderShulData(data);
      };
  });
}


function renderShulData(shul) {

  storage_data.shul_name = shul.name;
  storage_data.shul_id = shul._id;

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

  if (storage_data.access_level >= 5) {
    shulLine = `
      <div id="js-delete-shul">
        <div>
          <input type="submit" value="Delete This Shul" class="select"  id="js-delete-button"/>
        </div>
      </div>   `;
    content = content + shulLine;
    $('#js-shul-results').off('click');
    watchShulDelete();
  };

  $('#js-shul-results').html(content);
  hideLoginRevealResults("shul");

}


function watchShulDelete() {

  $( "#js-shul-results" ).on( "click", "#js-delete-shul", function( event ) {
    event.preventDefault();

    let check = confirm("Confirm permanent delete of shul: " + storage_data.shul_name + " ?");
    if (check == false) { return; }

    let route = '/shul/'+ storage_data.shul_id;

    $.ajax({
        url: route,
        method: "DELETE",
        success: function (data) {
          console.log("Deleted Shul" + storage_data.shul_name);
        },
        error: function (data) {
          console.log("Delete Shul FAILED: " + storage_data.shul_name + " ID: " + storage_data.shul_id);
          console.log(err);
        }
    });  //  ajax call

    storage_data.action = "display";
    storage_data.target = "shul";
    route = '/shul-all';
    getShulData (route);

  });

}


function renderMemberList(result) {

  let content = `<h2>${storage_data.shul_name}</h2>
                 <h2>Click Member name for detail</h2>`;

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
                  <input type="submit" value="${oneMember.called}" class="select" data-onememid="${oneMember._id}"/>
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

  $('#js-member-results').html(content);
  hideLoginRevealResults("member");
  $(watchMemberSelection);
}


function watchMemberSelection() {

    $( "#js-member-results" ).on( "click", "input", function( event ) {
      event.preventDefault();
      let element = event.currentTarget;
      let memberID = element.dataset.onememid;
      displayMemberData(memberID);
    });
}


function displayMemberData(memberID) {

  console.log('member ID: ' + memberID);
  storage_data.member_id = memberID;

  let route = '/member/' + memberID;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
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

  storage_data.member_id = member._id;

  let content = `<h2>${storage_data.shul_name}</h2>`;

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

  memberLine = `
    <div id="js-delete-member">
      <div>
        <input type="submit" value="Delete This Member" class="select"  id="js-delete-button"/>
      </div>
    </div>   `;
  content = content + memberLine;

  $('#js-member-results').off('click');
  watchMemberDelete();

  $('#js-member-results').html(content);
  hideLoginRevealResults("member");
}


function watchMemberDelete() {

  $( "#js-member-results" ).on( "click", "#js-delete-member", function( event ) {
    event.preventDefault();

    let check = confirm("Confirm *permanent* delete of this Member?");
    if (check == false) { return; }

    let route = '/member/'+ storage_data.member_id;

    $.ajax({
        url: route,
        method: "DELETE",
        success: function (data) {
          console.log("Deleted Member" + storage_data.member_id);
        },
        error: function (data) {
          console.log("Delete Member FAILED! ID: " + storage_data.member_id);
          console.log(err);
        }
    });  //  ajax call

    storage_data.action = "display";
    storage_data.target = "member";
    if (storage_data.shul_id) {
      let route = '/member-all/' + storage_data.shul_id;
      $.getJSON(route, function( data ) {
          renderMemberList(data);
      });
    }

  });

}


function renderServicesList(result) {

  let content = `<h2>${storage_data.shul_name}</h2>
                 <h2>Click Services date for detail</h2>`;

  let servicesLine = "";

  result.map(function(oneService) {
    if (oneService.shulId) {

      let when = oneService.parsha + " " + oneService.year;
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
                  <input type="submit" value="${when}" class="select" data-oneservid="${oneService._id}"/>
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

  $('#js-services-results').html(content);
  hideLoginRevealResults("services");
  $(watchServicesSelection);
}


function watchServicesSelection() {

  $( "#js-services-results" ).on( "click", "input", function( event ) {
    event.preventDefault();
    let element = event.currentTarget;
    let servicesID = element.dataset.oneservid;
    displayServicesData(servicesID);
  });
}


function displayServicesData(servicesID) {

  console.log('services ID: ' + servicesID);
  storage_data.services_id = servicesID;

  let route = '/services/' + servicesID;
  $.getJSON(route, function( data ) {
      if (data == 'undefined' || data == null) {
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

  storage_data.services_id = services._id;

  let when = "Parshas " + services.parsha + ", " + services.year;
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

  let content = `<h2>${storage_data.shul_name}</h2>`;

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

  servicesLine = `
    <div id="js-delete-services">
      <div>
        <input type="submit" value="Delete This Services" class="select"  id="js-delete-button"/>
      </div>
    </div>   `;

  content = content + servicesLine;

  $('#js-services-results').off('click');
  watchServicesDelete();

  $('#js-services-results').html(content);
  hideLoginRevealResults("services");
}


function watchServicesDelete() {

  $( "#js-services-results" ).on( "click", "#js-delete-services", function( event ) {
    event.preventDefault();

    let check = confirm("Confirm *permanent* delete of this Services instance?");
    if (check == false) { return; }

    let route = '/services/'+ storage_data.services_id;

    $.ajax({
        url: route,
        method: "DELETE",
        success: function (data) {
          console.log("Deleted Services" + storage_data.services_id);
        },
        error: function (data) {
          console.log("Delete Services FAILED! ID: " + storage_data.services_id);
          console.log(err);
        }
    });  //  ajax call

    storage_data.action = "display";
    storage_data.target = "services";
    if (storage_data.shul_id) {
      let route = '/services-all/' + storage_data.shul_id;
      $.getJSON(route, function( data ) {
          renderServicesList(data);
      });
    }

  });

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


function hideLoginRevealResults(reveal) {

  if ( ! $('#js-login-row').hasClass("hide") ) {
    $('#js-login-row').addClass("hide");
  };

  switch (reveal) {

    case 'shul':
      if ( $('#js-shul-results').hasClass("hide") ) {
        $('#js-shul-results').removeClass("hide");
      };
      if ( ! $('#js-member-results').hasClass("hide") ) {
        $('#js-member-results').addClass("hide");
      };
      if ( ! $('#js-services-results').hasClass("hide") ) {
        $('#js-services-results').addClass("hide");
      };
      break;

    case 'member':
      if ( $('#js-member-results').hasClass("hide") ) {
        $('#js-member-results').removeClass("hide");
      };
      if ( ! $('#js-shul-results').hasClass("hide") ) {
        $('#js-shul-results').addClass("hide");
      };
      if ( ! $('#js-services-results').hasClass("hide") ) {
        $('#js-services-results').addClass("hide");
      };
      break;

    case 'services':
      if ( $('#js-services-results').hasClass("hide") ) {
        $('#js-services-results').removeClass("hide");
      };
      if ( ! $('#js-member-results').hasClass("hide") ) {
        $('#js-member-results').addClass("hide");
      };
      if ( ! $('#js-shul-results').hasClass("hide") ) {
        $('#js-shul-results').addClass("hide");
      };
      break;

    default:
      console.log("Invalid value to reveal in hideLoginRevealResults: " + reveal);
  };   // switch

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

$(getLocalStorage);
$(watchLoginSubmit);
$(watchNewUserClick);
$(watchRegisterSubmit);
$(watchNavbarClicks);
