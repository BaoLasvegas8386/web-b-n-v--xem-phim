/* ============================================
      SEARCH ENGINE — FINAL FIXED VERSION
============================================ */

const searchInput = document.getElementById("searchInput");
const searchBox   = document.getElementById("searchResults");

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

  //  ẨN dropdown khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchBox.contains(e.target)) {
      searchBox.classList.remove("show");
    }
  });

  searchInput.addEventListener("input", () => {

    const key = searchInput.value.toLowerCase().trim();
    searchBox.innerHTML = "";

    if (!key) {
      searchBox.classList.remove("show");
      return;
    }

    const results = movies.filter(m =>
      m.title.toLowerCase().includes(key) ||
      m.genre.toLowerCase().includes(key)
    );

    if (results.length === 0) {
      searchBox.innerHTML = "<div class='search-item'>Không tìm thấy phim</div>";
      searchBox.classList.add("show");
      return;
    }

    searchBox.classList.add("show");

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
      CLICK MOVIE-CARD — CHUYỂN TRANG ĐẶT VÉ
============================================ */

document.querySelectorAll(".movie-card").forEach(card => {
  card.addEventListener("click", function(event) {

    // Nếu bấm vào nút giờ chiếu → không chạy card
    if (event.target.closest(".showtime-btn")) return;

    const link = card.dataset.link;
    if (!link) return;

    // Fade effect
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = link;
    }, 300);

  });
});


/* ============================================
      RIPPLE CLICK EFFECT (TUỲ CHỌN)
============================================ */

document.querySelectorAll(".movie-card").forEach(card => {
  card.addEventListener("click", function(e) {

    if (e.target.closest(".showtime-btn")) return;

    const rect = this.getBoundingClientRect();
    this.style.setProperty("--x", `${e.clientX - rect.left}px`);
    this.style.setProperty("--y", `${e.clientY - rect.top}px`);

    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 500);

  });
});
