'use strict'


console.log('Starting up');


$(document).ready(init)
$('.btn-add-email').click(onGoToEmail)

function init() {
  console.log('Started...')
  renderPortfolio()
  renderPortfolioModal()
}

function renderPortfolio() {
  var projs = createProjects()
  var strHTML = ''
  for (var i = 0; i < projs.length; i++) {
    strHTML += `<div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${i}">
        <div class="portfolio-hover">
        <div class="portfolio-hover-content">
        <i class="fa fa-plus fa-3x"></i>
        </div>
        </div>
        <img class="img-fluid" src="img/proj${i}.jpg" >
        </a>
        <div class="portfolio-caption">
        <p class="text-muted">${projs[i].title}</p>
        </div>
        </div>`
  }
  $('.portfolioContainer1').html(strHTML)
}
function renderPortfolioModal() {
  var projs = createProjects()
  var strHTML = ''
  for (var i = 0; i < projs.length; i++) {
    strHTML += `<div class="portfolio-modal modal fade" id="portfolioModal${i}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="close-modal" data-dismiss="modal">
              <div class="lr">
                <div class="rl"></div>
              </div>
            </div>
            <div class="container">
              <div class="row">
                <div class="col-lg-8 mx-auto">
                  <div class="modal-body">
                    <!-- Project Details Go Here -->
                    <h2>${projs[i].name}</h2>
                    <p class="item-intro text-muted">${projs[i].title}</p>
                    <a href="${projs[i].url}/index.html" class="btn btn-info my-2" target="_blank">Try Me!</a>
                    <img class="img-fluid d-block mx-auto" src="img/proj${i}.jpg" alt="">
                    <p>${projs[i].desc}</p>
                    <ul class="list-inline">
                      <li>Published at ${projs[i].publishedAt}</li>
                    </ul>
                    <button class="btn btn-primary" data-dismiss="modal" type="button">
                      <i class="fa fa-times"></i>
                      Close Project</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
  }
  $('.portfolioModalContainer').html(strHTML)
}

function onGoToEmail(ev) {
  ev.preventDefault()
  const email = $('#exampleInputEmail1').val()
  const subject = $('#exampleInputSubject1').val()
  const message = $('#exampleInputMessage1').val()
  window.open("https://mail.google.com/mail/?view=cm&fs=1&to="+email+".com&su="+subject+"&body="+message+"", "_blank")
  // window.location.assign("https://mail.google.com/mail/?view=cm&fs=1&to="+email+".com&su="+subject+"&body="+message+"")
}