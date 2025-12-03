/* ============================================
      SEARCH ENGINE — FIX HOÀN CHỈNH
============================================ */

const searchInput = document.getElementById("searchInput");
const searchBox = document.getElementById("searchResults");

if (searchInput && searchBox) {

  const movies = [
    {
      title: "Truy Tìm Long Diên Hương",
      img: "Picture/truytimlongdienhuong.jpg.jpg",
      genre: "Hành động, Hài hước",
      defaultTime: "10:20"
    },
    {
      title: "Cưới Vợ Cho Cha",
      img: "Picture/cuoivochocha.jpg.jpg",
      genre: "Hài hước, Tình cảm",
      defaultTime: "09:40"
    },
    {
      title: "Phi Vụ Động Trời 2",
      img: "Picture/zootopia2.jpg.jpg",
      genre: "Hoạt hình, Phiêu lưu",
      defaultTime: "11:10"
    },
    {
      title: "Phòng Trọ Ma Bầu",
      img: "Picture/phongtroma-bau.jpg.jpg",
      genre: "Kinh dị, Hài hước",
      defaultTime: "10:00"
    }
  ];

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchBox.contains(e.target)) {
      searchBox.style.display = "none";
    }
  });

  searchInput.addEventListener("input", () => {

    const key = searchInput.value.toLowerCase().trim();
    searchBox.innerHTML = "";

    if (!key) {
      searchBox.style.display = "none";
      return;
    }

    const results = movies.filter(m =>
      m.title.toLowerCase().includes(key) ||
      m.genre.toLowerCase().includes(key)
    );

    if (results.length === 0) {
      searchBox.innerHTML = "<div class='search-item'>Không tìm thấy phim</div>";
      searchBox.style.display = "block";
      return;
    }

    searchBox.style.display = "block";

    results.forEach(movie => {
      let div = document.createElement("div");
      div.className = "search-item";

      div.innerHTML = `
        <img src="${movie.img}">
        <div>
          <strong>${movie.title}</strong><br>
          <span style="font-size:12px; color:#777">${movie.genre}</span>
        </div>
      `;

      div.onclick = () => {
        window.location.href =
          `booking.html?movie=${encodeURIComponent(movie.title)}&img=${movie.img}&time=${movie.defaultTime}`;
      };

      searchBox.appendChild(div);
    });

  });
}


/* ============================================
      CLICK MOVIE-CARD — CHUYỂN TRANG
============================================ */

document.querySelectorAll(".movie-card").forEach(card => {

  card.addEventListener("click", function (event) {

    if (event.target.closest(".showtime-btn")) return;

    const link = card.dataset.link;
    if (!link) return;

    window.location.href = link;

  });

});


/* ============================================
      SEATS PAGE — CHỌN GHẾ
============================================ */

if (document.getElementById("seatArea")) {

  const seatArea = document.getElementById("seatArea");
  const goPayment = document.getElementById("goPayment");
  const rows = ["A", "B", "C", "D", "E"];
  const selectedSeats = [];

  document.getElementById("movieName").textContent = localStorage.getItem("movie");
  document.getElementById("cinemaName").textContent = localStorage.getItem("cinema");
  document.getElementById("dateShow").textContent = localStorage.getItem("date");
  document.getElementById("showtime").textContent = localStorage.getItem("time");

  rows.forEach(r => {
    for (let i = 1; i <= 10; i++) {
      const code = r + i;
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.dataset.seat = code;
      seat.textContent = code;

      seat.onclick = () => {
        seat.classList.toggle("selected");

        if (selectedSeats.includes(code)) {
          selectedSeats.splice(selectedSeats.indexOf(code), 1);
        } else {
          selectedSeats.push(code);
        }
      };

      seatArea.appendChild(seat);
    }
  });

  goPayment.onclick = () => {
    if (selectedSeats.length === 0) {
      alert("Bạn chưa chọn ghế!");
      return;
    }

    localStorage.setItem("seats", JSON.stringify(selectedSeats));
    window.location.href = "payment.html";
  };

}


/* ============================================
      PAYMENT PAGE
============================================ */

if (document.getElementById("totalMoney")) {

  const movie = localStorage.getItem("movie");
  const cinema = localStorage.getItem("cinema");
  const date = localStorage.getItem("date");
  const time = localStorage.getItem("time");
  const seats = JSON.parse(localStorage.getItem("seats"));

  document.getElementById("movieName").textContent = movie;
  document.getElementById("cinemaName").textContent = cinema;
  document.getElementById("dateShow").textContent = date;
  document.getElementById("showtime").textContent = time;
  document.getElementById("seatList").textContent = seats.join(", ");

  const total = seats.length * 65000;
  document.getElementById("totalMoney").textContent = total.toLocaleString() + "đ";

  document.getElementById("confirmPay").onclick = () => {
    window.location.href = "ticket.html";
  };
}


/* ============================================
      TICKET PAGE
============================================ */

if (document.getElementById("ticketPage")) {

  document.getElementById("movieName").textContent = localStorage.getItem("movie");
  document.getElementById("cinemaName").textContent = localStorage.getItem("cinema");
  document.getElementById("dateShow").textContent = localStorage.getItem("date");
  document.getElementById("showtime").textContent = localStorage.getItem("time");

  const seats = JSON.parse(localStorage.getItem("seats"));
  document.getElementById("seatList").textContent = seats.join(", ");
}
