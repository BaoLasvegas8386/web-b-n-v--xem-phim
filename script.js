/* script.js - quản lý logic frontend (localStorage) */

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* ---------- Data init (movies, cinemas) ---------- */
function initData() {
  if (!localStorage.getItem('movies')) {
    const movies = [
      { id: 'm1', title: 'Truy Tìm Long Diên Hương', duration: "1h43'", poster:'https://i.imgur.com/9hKz9Xo.jpeg', type:'2D' , showtimes:['10:20','13:40','18:00','21:40'] },
      { id: 'm2', title: 'Anh Trai Say Xỉn', duration: "1h50'", poster:'https://i.imgur.com/aAe2BrM.jpeg', type:'2D', showtimes:['11:20','13:20','16:00'] }
    ];
    localStorage.setItem('movies', JSON.stringify(movies));
  }
  if (!localStorage.getItem('cinemas')) {
    const cinemas = [
      { id:'c1', name:'Beta Quang Trung' },
      { id:'c2', name:'Beta Thu Duc' },
      { id:'c3', name:'Beta Phu My Hung' }
    ];
    localStorage.setItem('cinemas', JSON.stringify(cinemas));
  }
  if (!localStorage.getItem('bookedSeats')) localStorage.setItem('bookedSeats', JSON.stringify({}));
}
initData();

/* ---------- Render movie list (for pages that need it) ---------- */
function renderMoviesGrid(selector, includeBookButtons=true) {
  const el = $(selector);
  if (!el) return;
  const movies = JSON.parse(localStorage.getItem('movies') || '[]');
  el.innerHTML = movies.map(m => `
    <div class="movie-card">
      <img src="${m.poster}" alt="${m.title}">
      <h4>${m.title}</h4>
      <div class="movie-meta">${m.type} • ${m.duration}</div>
      <div class="showtimes">
        ${m.showtimes.map(t => `<button class="${includeBookButtons? 'primary':''}" onclick="startBooking('${m.id}','${t}')">${t}</button>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ---------- Start booking: save movie/time then go booking.html ---------- */
function startBooking(movieId, time) {
  const movies = JSON.parse(localStorage.getItem('movies')||'[]');
  const movie = movies.find(m=>m.id===movieId);
  if (!movie) return alert('Phim không tồn tại');
  localStorage.setItem('selectedMovie', JSON.stringify({id:movie.id, title:movie.title, time}));
  // redirect booking page
  window.location.href = 'booking.html';
}

/* ---------- Load booking page info ---------- */
function loadBookingPage() {
  const sel = JSON.parse(localStorage.getItem('selectedMovie')||'null');
  if (!sel) {
    // nếu không có thì về index
    // window.location.href = 'index.html';
    $('#movieInfo') && ($('#movieInfo').innerText = 'Chưa chọn phim');
    return;
  }
  $('#movieInfo').innerHTML = `<strong>${sel.title}</strong><div style="color:#666;font-size:13px">Suất: ${sel.time}</div>`;
  // show cinema selection
  const cinemas = JSON.parse(localStorage.getItem('cinemas')||'[]');
  const cSel = $('#cinemaSelect');
  if (cSel) {
    cSel.innerHTML = cinemas.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  }
  renderSeatGrid();
  updateInfo();
}

/* ---------- Seat grid render + selection ---------- */
function renderSeatGrid() {
  const container = $('#seatGrid');
  if (!container) return;
  // generate 50 seats labeled A1-A10,B1-B10,C1-C10,D1-D10,E1-E10
  const rows = ['A','B','C','D','E'];
  let html = '';
  const booked = JSON.parse(localStorage.getItem('bookedSeats')||'{}');
  const sel = JSON.parse(localStorage.getItem('selectedMovie')||'null');
  const cinemaId = $('#cinemaSelect') ? $('#cinemaSelect').value : (localStorage.getItem('lastCinema')||null);
  // booked structure: { "c1": {"m1|10:20":["A1","A2"] }, ...}
  rows.forEach(r=>{
    for(let i=1;i<=10;i++){
      const code = r+i;
      let isBooked = false;
      if (booked[cinemaId] && booked[cinemaId][ `${sel ? sel.id+ '|' + sel.time : ''}` ]) {
        isBooked = booked[cinemaId][ `${sel.id}|${sel.time}` ].includes(code);
      }
      html += `<div class="seat ${isBooked? 'booked':''}" data-seat="${code}" onclick="toggleSeat(this)">${code}</div>`;
    }
  });
  container.innerHTML = html;
}

/* ---------- toggle seat ---------- */
function toggleSeat(elem) {
  if (elem.classList.contains('booked')) return;
  elem.classList.toggle('selected');
  updateInfo();
}

/* ---------- update seat count & price ---------- */
function updateInfo() {
  const selectedSeats = $$('.seat.selected').map(el=>el.dataset.seat);
  $('#seatCount') && ($('#seatCount').innerText = selectedSeats.length);
  const pricePer = Number($('#pricePer') ? $('#pricePer').innerText.replace(/\D/g,'') : 75000);
  const total = selectedSeats.length * pricePer;
  $('#totalPrice') && ($('#totalPrice').innerText = total.toLocaleString());
}

/* ---------- go to payment ---------- */
function goToPayment() {
  const selectedSeats = $$('.seat.selected').map(el=>el.dataset.seat);
  if (selectedSeats.length === 0) return alert('Vui lòng chọn ít nhất 1 ghế');
  const sel = JSON.parse(localStorage.getItem('selectedMovie')||'{}');
  const cinemaId = $('#cinemaSelect') ? $('#cinemaSelect').value : null;
  const cinemas = JSON.parse(localStorage.getItem('cinemas')||'[]');
  const cinema = cinemas.find(c=>c.id===cinemaId) || cinemas[0];
  const pricePer = Number($('#pricePer') ? $('#pricePer').innerText.replace(/\D/g,'') : 75000);
  const total = selectedSeats.length * pricePer;
  const order = {
    id: 'ORD' + Date.now(),
    movieId: sel.id,
    movieTitle: sel.title,
    time: sel.time,
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    seats: selectedSeats,
    total
  };
  localStorage.setItem('currentOrder', JSON.stringify(order));
  // redirect to payment
  window.location.href = 'payment.html';
}

/* ---------- payment processing (simulate) ---------- */
function loadPaymentPage() {
  const order = JSON.parse(localStorage.getItem('currentOrder')||'null');
  if (!order) return window.location.href='index.html';
  $('#p_movie').innerText = order.movieTitle;
  $('#p_time').innerText = order.time;
  $('#p_cinema').innerText = order.cinemaName;
  $('#p_seats').innerText = order.seats.join(', ');
  $('#p_total').innerText = order.total.toLocaleString();
}
function doPayment(method) {
  // simulate success -> mark seats as booked
  const order = JSON.parse(localStorage.getItem('currentOrder')||'null');
  if (!order) return;
  const booked = JSON.parse(localStorage.getItem('bookedSeats')||'{}');
  booked[order.cinemaId] = booked[order.cinemaId] || {};
  const key = `${order.movieId}|${order.time}`;
  booked[order.cinemaId][key] = booked[order.cinemaId][key] || [];
  // append seats
  order.seats.forEach(s => {
    if (!booked[order.cinemaId][key].includes(s)) booked[order.cinemaId][key].push(s);
  });
  localStorage.setItem('bookedSeats', JSON.stringify(booked));
  // create ticket object
  const ticket = {
    code: 'T' + Math.random().toString(36).substring(2,9).toUpperCase(),
    orderId: order.id,
    movie: order.movieTitle,
    time: order.time,
    cinema: order.cinemaName,
    seats: order.seats,
    total: order.total,
    paidBy: method,
    created: new Date().toISOString()
  };
  localStorage.setItem('ticket', JSON.stringify(ticket));
  // clear currentOrder
  localStorage.removeItem('currentOrder');
  // redirect to ticket
  window.location.href = 'ticket.html';
}

/* ---------- ticket page ---------- */
function loadTicketPage() {
  const t = JSON.parse(localStorage.getItem('ticket')||'null');
  if (!t) return window.location.href='index.html';
  $('#t_code').innerText = t.code;
  $('#t_movie').innerText = t.movie;
  $('#t_time').innerText = t.time;
  $('#t_cinema').innerText = t.cinema;
  $('#t_seats').innerText = t.seats.join(', ');
  $('#t_total').innerText = t.total.toLocaleString();
}

/* ---------- ADMIN: add movie / add cinema ---------- */
function adminInit() {
  renderAdminMovies();
  renderAdminCinemas();
}
function addMovie(){
  const title = $('#movieTitle').value.trim();
  const duration = $('#movieDuration').value.trim();
  const poster = $('#moviePoster').value.trim() || 'https://via.placeholder.com/300x400';
  const showtimes = $('#movieShowtimes').value.trim().split(',').map(s=>s.trim()).filter(Boolean);
  if(!title||showtimes.length===0) return alert('Nhập đủ thông tin');
  const movies = JSON.parse(localStorage.getItem('movies')||'[]');
  movies.push({id:'m'+Date.now(), title, duration, poster, type:'2D', showtimes});
  localStorage.setItem('movies', JSON.stringify(movies));
  renderAdminMovies();
  alert('Thêm phim OK');
}
function addCinema(){
  const name = $('#cinemaName').value.trim();
  if(!name) return alert('Nhập tên rạp');
  const cinemas = JSON.parse(localStorage.getItem('cinemas')||'[]');
  cinemas.push({id:'c'+Date.now(), name});
  localStorage.setItem('cinemas', JSON.stringify(cinemas));
  renderAdminCinemas();
  alert('Thêm rạp OK');
}
function renderAdminMovies(){
  const list = $('#adminMovies');
  if(!list) return;
  const movies = JSON.parse(localStorage.getItem('movies')||'[]');
  list.innerHTML = movies.map(m => `<div style="padding:8px;border-bottom:1px dashed #eee"><strong>${m.title}</strong><div style="font-size:13px;color:#666">${m.showtimes.join(', ')}</div></div>`).join('');
}
function renderAdminCinemas(){
  const list = $('#adminCinemas');
  if(!list) return;
  const cinemas = JSON.parse(localStorage.getItem('cinemas')||'[]');
  list.innerHTML = cinemas.map(c=>`<div style="padding:8px;border-bottom:1px dashed #eee">${c.name}</div>`).join('');
}

/* ---------- export functions to global (so html onclick works) ---------- */
window.renderMoviesGrid = renderMoviesGrid;
window.startBooking = startBooking;
window.loadBookingPage = loadBookingPage;
window.toggleSeat = toggleSeat;
window.updateInfo = updateInfo;
window.goToPayment = goToPayment;
window.loadPaymentPage = loadPaymentPage;
window.doPayment = doPayment;
window.loadTicketPage = loadTicketPage;
window.addMovie = addMovie;
window.addCinema = addCinema;
window.adminInit = adminInit;
window.renderAdminMovies = renderAdminMovies;
window.renderAdminCinemas = renderAdminCinemas;
