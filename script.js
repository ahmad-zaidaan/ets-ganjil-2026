const KUNCI_PENYIMPANAN = "ets:money-management";

const state = {
	amplop: [
		{ id: "amplop-1", nama: "Belanja Dapur", jatah: 1500000 },
		{ id: "amplop-2", nama: "Listrik & Air", jatah: 500000 },
		{ id: "amplop-3", nama: "Pendidikan Anak", jatah: 800000 },
		{ id: "amplop-4", nama: "Lain-lain", jatah: 300000 },
	],
	transaksi: [],
};

// ------------------- CONST

const modalTransaksi = document.getElementById("modal-transaksi");
const modalAmplop = document.getElementById("modal-amplop");

const btnBukaTransaksi = document.querySelector(".tambah-transaksi");
const btnTutupTransaksi = document.getElementById("btn-tutup-transaksi");
const btnBatalTransaksi = document.getElementById("btn-batal-transaksi");

const btnBukaAmplop = document.querySelector(".tambah-amplop");
const btnTutupAmplop = document.getElementById("btn-tutup-amplop");
const btnBatalAmplop = document.getElementById("btn-batal-amplop");

const formTransaksi = document.getElementById("form-transaksi");
const formAmplop = document.getElementById("form-amplop");

const wadahAmplop = document.querySelector(".amplops");
const tabelBody = document.getElementById("daftar-transaksi");
const selectKategori = document.getElementById("kategori-transaksi");

const heroBalance = document.querySelector(".card-hero .balance h1");
const heroDetails = document.querySelector(".balance-details");

function formatRupiah(angka) {
	return "Rp " + Number(angka).toLocaleString("id-ID");
}

// ------------------- DATA

function simpanData() {
	localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(state));
}

function loadData() {
	try {
		const tersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);

		if (tersimpan !== null) {
			const data = JSON.parse(tersimpan);
			if (data.amplop && data.amplop.length > 0) {
				state.amplop = data.amplop;
			}
			if (data.transaksi) {
				state.transaksi = data.transaksi;
			}
		}
	} catch (error) {
		console.error(error);
	}
}

// ------------------- RENDER

function perbaruiPilihanKategori() {
	selectKategori.textContent = "";
	state.amplop.forEach((a) => {
		const option = document.createElement("option");
		option.value = a.nama;
		option.textContent = a.nama;
		selectKategori.append(option);
	});
}

function renderRingkasan() {
	let totalPemasukan = 0;
	let totalPengeluaran = 0;

	state.transaksi.forEach((t) => {
		if (t.jenis === "pemasukan") {
			totalPemasukan += t.nominal;
		} else if (t.jenis === "pengeluaran") {
			totalPengeluaran += t.nominal;
		}
	});

	const saldo = totalPemasukan - totalPengeluaran;
	heroBalance.textContent = formatRupiah(saldo);

	heroDetails.textContent = "";

	const pPemasukan = document.createElement("p");
	pPemasukan.textContent = "+ " + formatRupiah(totalPemasukan);

	const pPengeluaran = document.createElement("p");
	pPengeluaran.textContent = "- " + formatRupiah(totalPengeluaran);

	heroDetails.append(pPemasukan, pPengeluaran);
}

function renderAmplop() {
	wadahAmplop.textContent = "";

	state.amplop.forEach((itemAmplop) => {
		const totalTerpakai = state.transaksi
			.filter((t) => t.jenis === "pengeluaran" && t.kategori === itemAmplop.nama)
			.reduce((total, t) => total + t.nominal, 0);

		const sisa = itemAmplop.jatah - totalTerpakai;

		const kartu = document.createElement("div");
		kartu.className = "amplop";

		const headerKartu = document.createElement("div");
		headerKartu.style.display = "flex";
		headerKartu.style.justifyContent = "space-between";
		headerKartu.style.alignItems = "center";

		const judul = document.createElement("h3");
		judul.textContent = itemAmplop.nama;

		const aksiDiv = document.createElement("div");
		aksiDiv.style.display = "flex";
		aksiDiv.style.alignItems = "center";
		aksiDiv.style.gap = "0.5rem";

		if (sisa <= 0) {
			const badge = document.createElement("span");
			badge.textContent = "HABIS";
			badge.style.backgroundColor = "#ba3828";
			badge.style.color = "white";
			badge.style.fontSize = "0.75rem";
			badge.style.fontWeight = "bold";
			badge.style.padding = "0.2rem 0.6rem";
			badge.style.borderRadius = "9999px";
			aksiDiv.append(badge);
		}

		const btnHapusAmplop = document.createElement("button");
		btnHapusAmplop.type = "button";
		btnHapusAmplop.textContent = "Hapus";
		btnHapusAmplop.dataset.aksi = "hapus-amplop";
		btnHapusAmplop.dataset.id = String(itemAmplop.id);
		btnHapusAmplop.style.cursor = "pointer";
		btnHapusAmplop.style.backgroundColor = "transparent";
		btnHapusAmplop.style.color = "var(--expense-color)";
		btnHapusAmplop.style.border = "1px solid var(--expense-color)";
		btnHapusAmplop.style.borderRadius = "0.5rem";
		btnHapusAmplop.style.padding = "0.2rem 0.6rem";
		btnHapusAmplop.style.fontSize = "0.75rem";
		aksiDiv.append(btnHapusAmplop);

		headerKartu.append(judul, aksiDiv);

		const balanceDiv = document.createElement("div");
		balanceDiv.className = "amplop-balance";

		const h1Sisa = document.createElement("h1");
		h1Sisa.textContent = formatRupiah(sisa);

		const pKeterangan = document.createElement("p");
		pKeterangan.style.fontSize = "0.85rem";
		pKeterangan.style.color = "var(--text-muted)";
		pKeterangan.textContent = "dari " + formatRupiah(itemAmplop.jatah);

		balanceDiv.append(h1Sisa, pKeterangan);
		kartu.append(headerKartu, balanceDiv);
		wadahAmplop.append(kartu);
	});
}

function renderTransaksi() {
	tabelBody.textContent = "";

	if (state.transaksi.length === 0) {
		const barisKosong = document.createElement("tr");
		const sel = document.createElement("td");
		sel.colSpan = 6;
		sel.textContent = "Belum ada transaksi.";
		sel.style.textAlign = "center";
		sel.style.color = "var(--text-muted)";
		barisKosong.append(sel);
		tabelBody.append(barisKosong);
		return;
	}

	const transaksiUrut = [...state.transaksi].reverse();

	transaksiUrut.forEach((t) => {
		const baris = document.createElement("tr");

		const tdTanggal = document.createElement("td");
		tdTanggal.textContent = t.tanggal;

		const tdJenis = document.createElement("td");
		tdJenis.textContent = t.jenis.toUpperCase();
		tdJenis.style.fontWeight = "600";
		tdJenis.style.color = t.jenis === "pemasukan" ? "var(--income-color)" : "var(--expense-color)";

		const tdKategori = document.createElement("td");
		tdKategori.textContent = t.kategori;

		const tdCatatan = document.createElement("td");
		tdCatatan.textContent = t.catatan || "-";

		const tdNominal = document.createElement("td");
		tdNominal.textContent = formatRupiah(t.nominal);
		tdNominal.style.fontWeight = "bold";

		const tdAksi = document.createElement("td");
		const btnHapus = document.createElement("button");
		btnHapus.type = "button";
		btnHapus.textContent = "Hapus";
		btnHapus.dataset.aksi = "hapus";
		btnHapus.dataset.id = String(t.id);
		btnHapus.style.cursor = "pointer";
		btnHapus.style.backgroundColor = "transparent";
		btnHapus.style.color = "var(--expense-color)";
		btnHapus.style.border = "1px solid var(--expense-color)";
		btnHapus.style.borderRadius = "0.5rem";
		btnHapus.style.padding = "0.3rem 0.8rem";
		btnHapus.style.fontSize = "0.8rem";

		tdAksi.append(btnHapus);
		baris.append(tdTanggal, tdJenis, tdKategori, tdCatatan, tdNominal, tdAksi);
		tabelBody.append(baris);
	});
}

function render(stateObj) {
	renderRingkasan();
	renderAmplop();
	renderTransaksi();
	perbaruiPilihanKategori();
}

// ------------------- EVENTS

btnBukaTransaksi.addEventListener("click", () => {
	modalTransaksi.showModal();
});
btnTutupTransaksi.addEventListener("click", () => modalTransaksi.close());
btnBatalTransaksi.addEventListener("click", () => modalTransaksi.close());

btnBukaAmplop.addEventListener("click", () => {
	modalAmplop.showModal();
});
btnTutupAmplop.addEventListener("click", () => modalAmplop.close());
btnBatalAmplop.addEventListener("click", () => modalAmplop.close());

formAmplop.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputNama = document.getElementById("nama-amplop");
	const inputJatah = document.getElementById("jatah-amplop");

	const nama = inputNama.value.trim();
	const jatah = Number(inputJatah.value);

	if (nama === "" || jatah <= 0) {
		return;
	}

	const amplopAda = state.amplop.find((a) => a.nama.toLowerCase() === nama.toLowerCase());
	if (amplopAda) {
		amplopAda.jatah = jatah;
	} else {
		state.amplop.push({
			id: "amplop-" + Date.now(),
			nama: nama,
			jatah: jatah,
		});
	}

	simpanData();
	render(state);
	formAmplop.reset();
	modalAmplop.close();
});

formTransaksi.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputTanggal = document.getElementById("tgl-transaksi");
	const selectJenis = document.getElementById("jenis-transaksi");
	const selectKat = document.getElementById("kategori-transaksi");
	const inputNominal = document.getElementById("nominal-transaksi");
	const inputCatatan = document.getElementById("catatan-transaksi");

	const tanggal = inputTanggal.value;
	const nominal = Number(inputNominal.value);

	if (!tanggal || nominal <= 0) {
		return;
	}

	state.transaksi.push({
		id: Date.now(),
		tanggal: tanggal,
		jenis: selectJenis.value,
		kategori: selectKat.value,
		nominal: nominal,
		catatan: inputCatatan.value.trim(),
	});

	simpanData();
	render(state);
	formTransaksi.reset();
	modalTransaksi.close();
});

wadahAmplop.addEventListener("click", (e) => {
	const tombol = e.target.closest("[data-aksi='hapus-amplop']");
	if (!tombol) return;

	const idHapus = tombol.dataset.id;
	const yakin = confirm("Apakah Anda yakin ingin menghapus amplop ini?");
	if (!yakin) return;

	state.amplop = state.amplop.filter((a) => String(a.id) !== idHapus);
	simpanData();
	render(state);
});

tabelBody.addEventListener("click", (e) => {
	const tombol = e.target.closest("[data-aksi='hapus']");
	if (!tombol) return;

	const idHapus = Number(tombol.dataset.id);
	const yakin = confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
	if (!yakin) return;

	state.transaksi = state.transaksi.filter((t) => t.id !== idHapus);
	simpanData();
	render(state);
});

loadData();
render(state);
