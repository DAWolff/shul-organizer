'use strict'

var LOCAL_HOST = 'http://localhost:8080';

function getLoginCredentials(email, pw, callback) {
  const query = "";
  let loginURL = LOCAL_HOST + '/user/' + email + '/pw/' + pw;
  console.log(loginURL);
  $.getJSON(loginURL, query, callback);
}

function registerNewGabbaiAndShul(email, pw, shulName, shulCalled, callback) {
  const query = "";
  let loginURL = LOCAL_HOST + '/newUser/' + email + '/pw/' + pw + '/shulName/' + shulName + '/shulCalled/' + shulCalled;
  $.getJSON(loginURL, query, callback);
}

// function renderResult(result) {
//   return `
//     <div>
//       <h2>
//       <a class="js-result-name" href="${result.html_url}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a></h2>
//       <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
//       <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>
//     </div>
//   `;
// }

function watchLoginSubmit() {
  $('#js-login').click(event => {
    event.preventDefault();
    let email = $( "input[name='email']" ).val();
    let pw =  $( "input[name='pw']" ).val();
    getLoginCredentials(email, pw, checkLoginCredentials);
  });
}

function checkLoginCredentials(data) {
  console.log(data);
  // const results = data.items.map((item, index) => renderResult(item));
  // $('.js-search-results').html(results);
}

function watchRegisterSubmit() {
  $('#js-register').click(event => {
    event.preventDefault();
    let email = $( "input[name='email']" ).val();
    let pw =  $( "input[name='pw']" ).val();
    let shulName = $( "input[name='shul-name']" ).val();
    let shulCalled = $( "input[name='shul-called']" ).val();
    registerNewGabbaiAndShul(email, pw, shulName, shulCalled, checkNewGabbaiAndShul);
  });
}

function checkNewGabbaiAndShul(data) {
  console.log(data);
  // const results = data.items.map((item, index) => renderResult(item));
  // $('.js-search-results').html(results);
}

function watchNewUserSubmit() {
  $('#js-new-shul').click(event => {
    event.preventDefault();
    $( "input[name='email']" ).attr('placeholder', "Gabbai's email");
    $('#login-container').height("73vh");
    $('.login').toggleClass( "hide" );
    $('.register').toggleClass( "hide" );
  });
}

$(watchNewUserSubmit);
$(watchLoginSubmit);
$(watchRegisterSubmit);
