'use strict'
// window.location.href = "../shul-read.html"
var LOCAL_HOST = 'http://localhost:8080';
var loggedIn = false;
var accessLevel = 0;
var shulID = "";
const query = "";

function watchLoginSubmit() {
  $('#js-login').click(event => {
    event.preventDefault();
    let email = $( "input[name='email']" ).val();
    let pw =  $( "input[name='pw']" ).val();
    getLoginCredentials(email, pw);
  });
}

function getLoginCredentials(email, pw) {
  let loginURL = LOCAL_HOST + '/user/' + email + '/pw/' + pw;
  $.getJSON(loginURL, function( data ) {
      // console.log(data);
      const results = data.map((item, index) => {
        if (typeof(item) == 'undefined' || item == null) {
          // modal - invalid login
          console.log('invalid login');
        }
        else {
          if (item.schemaType === 'user') {
            accessLevel = item.accessLevel;
            shulID = item.shulId;
            loggedIn = true;
            console.log('logged in. access: ' + accessLevel + ' shulID: ' + shulID);
            if (accessLevel === 3) {
              displayShulData(shulID);
            }
            }
        };
      });
  });
}

function watchRegisterSubmit() {
  $('#js-register').click(event => {
    event.preventDefault();
    let email = $( "input[name='email']" ).val();
    let pw =  $( "input[name='pw']" ).val();
    let shulName = $( "input[name='shul-name']" ).val();
    let shulCalled = $( "input[name='shul-called']" ).val();
    registerNewGabbaiAndShul(email, pw, shulName, shulCalled);
  });
}

function registerNewGabbaiAndShul(email, pw, shulName, shulCalled) {
  let postURL = LOCAL_HOST + '/newUser/' + email + '/pw/' + pw + '/shulName/' + shulName + '/shulCalled/' + shulCalled;
  $.post(postURL, function( data ) {
      // console.log(data);
      const results = data.map((item, index) => {
        if (typeof(item) == 'undefined' || item == null) {
          // modal - invalid login
          console.log('invalid register-new-shul');
        }
        else {
          if (item.schemaType === 'user') {
            accessLevel = item.accessLevel;
            shulID = item.shulId;
            loggedIn = true;
            console.log('registered! access: ' + accessLevel + ' shulID: ' + shulID);
            // if this is a gabbai, display shul update screen.....
            }
        };
      });
  });
}

function watchNewUserClick() {
  $('#js-new-shul').click(event => {
    event.preventDefault();
    $( "input[name='email']" ).attr('placeholder', "Gabbai's email");
    $('#login-container').height("73vh");
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

  $('#shul-icon').click(event => {
    event.preventDefault();

    if (accessLevel <= 1) {
      let targetURL = LOCAL_HOST + '/shul-all-public';
      $.getJSON(targetURL, function( data ) {
          renderShulList(data);
      });
    };

    if (accessLevel === 3) {
      displayShulData(shulID);
    }

    if (accessLevel >= 5) {
      let targetURL = LOCAL_HOST + '/shul-all';
      $.getJSON(targetURL, function( data ) {
          renderShulList(data);
      });
    }
  });

  $('#member-icon').click(event => {
    event.preventDefault();
    console.log("you hit the member icon");
    // $('#content').toggleClass( "hide" );

  });

  $('#services-icon').click(event => {
    event.preventDefault();
    console.log('you hit the services icon');

  });
}

function renderShulList(result) {

  let content = `<h2>Click Shul name for detail</h2>`;
  let shulLine = "";

  // var itemElements = result.map(function(oneShul) {
  result.map(function(oneShul) {
    if (typeof(oneShul.called) == 'undefined' || typeof(oneShul.called) == null) {}
    else {
      let street = " ";
      let city = " ";
      let state = " ";
      if (typeof(oneShul.address) == 'undefined' || typeof(oneShul.address) == null) {}
      else {
        street = oneShul.address.street;
        city = oneShul.address.city;
        state = oneShul.address.state;
      };
      shulLine = `
              <div class="js-result-field">
                <div class="js-result-button">
                  <input type="submit" value="${oneShul.called}" class="select" data-shulid="${oneShul._id}"/>
                </div>
                <div class="js-result-content">
                 ${oneShul.name} &nbsp ${street} &nbsp ${city}, &nbsp ${state}
                </div>
              </div>
          `
      content = content + shulLine
    };  // else
  });   // map
  $('#navbar').css( "border-bottom", "3px solid #1c2833" );
  $('#footer').css( "border-top", "3px solid #1c2833" );
  $('#content').toggleClass( "hide" );
  $('#js-results').html(content);
  $('#js-results').toggleClass( "hide" );
  $(watchShulselection);
}

function watchShulselection() {
    $( "#js-results" ).on( "click", "input", function( event ) {
      event.preventDefault();
      // console.log( $( this ).text() );  // zz
      let element = event.currentTarget;
      let shulID = element.dataset.shulid;
      displayShulData(shulID);
    });
}

function displayShulData(shulIdIn) {
  console.log('shul ID: ' + shulIdIn);
  let targetURL = LOCAL_HOST + '/shul/' + shulIdIn;
  $.getJSON(targetURL, function( data ) {
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
  // $('#navbar').css( "border-bottom", "1px solid black" );   this is already done
  // $('#footer').css( "border-top", "1px solid black" );
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

  if (typeof(shul.public) == 'undefined' || typeof(shul.public) == null)
      {}
  else {
    shulLine = `
        <div class="js-result-field">
            <div class="js-result-label">Publicly visible?
              <div class="js-result-content">${shul.public}</div>
            </div>
        </div>   `
    content = content + shulLine
    };

    let street = ""; let city = ""; let state = "";
    if (typeof(shul.address) == 'undefined' || typeof(shul.address) == null) {}
    else {
      street = shul.address.street;
      city = shul.address.city;
      state = shul.address.state;
      shulLine = `
          <div class="js-result-field">
              <div class="js-result-label">Address
                <div class="js-result-content">${street} &nbsp ${city}, &nbsp ${state}</div>
              </div>
          </div>   `
      content = content + shulLine
  };

  $('#js-results').html(content);
}
//   rabbi: String,
//   asstRabbi: String,
//   chazan: String,
//   board: [{
//     title: Date,
//     person: String
//   }],
//   shabbos: {
//     minchaErevShabbos: String,
//     kabolasShabbos: String,
//     shacharis: String,
//     mincha: String,
//     maariv: String
//   },
//   weekday: {
//     shacharis1: String,
//     shacharis2: String,
//     shacharis3: String,
//     mincha: String,
//     maariv1: String,
//     maariv2: String
//   },
//   sundayLegalHoliday: {
//     shacharis1: String,
//     shacharis2: String,
//     shacharis3: String
//   },
//   events: [{
//     label: String,
//     date: String,
//     desc: String
//   }],
//   notes: String
// });



$(watchLoginSubmit);
$(watchNewUserClick);
$(watchRegisterSubmit);
$(watchNavbarClicks);
