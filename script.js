// Modals
const modalTransaksi = document.getElementById("modal-transaksi");
const modalAmplop = document.getElementById("modal-amplop");

const btnBukaTransaksi = document.querySelector(".tambah-transaksi");
const btnTutupTransaksi = document.getElementById("btn-tutup-transaksi");
const btnBatalTransaksi = document.getElementById("btn-batal-transaksi");

const btnBukaAmplop = document.querySelector(".tambah-amplop");
const btnTutupAmplop = document.getElementById("btn-tutup-amplop");
const btnBatalAmplop = document.getElementById("btn-batal-amplop");

btnBukaTransaksi.addEventListener("click", () => modalTransaksi.showModal());
btnTutupTransaksi.addEventListener("click", () => modalTransaksi.close());
btnBatalTransaksi.addEventListener("click", () => modalTransaksi.close());

btnBukaAmplop.addEventListener("click", () => modalAmplop.showModal());
btnTutupAmplop.addEventListener("click", () => modalAmplop.close());
btnBatalAmplop.addEventListener("click", () => modalAmplop.close());

export function