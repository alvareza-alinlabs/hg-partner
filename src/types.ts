export interface ClientData {
  id: string;
  tipe: "Sales" | "Distributor" | "End User";
  perusahaan: string;
  jenis_perusahaan?: string;
  provinsi: string;
  kota: string;
  area: string;
  alamat_detail: string;
  koordinat_lat: number;
  koordinat_long: number;
  telepon_kantor: string;
  email_kantor: string;
  nama_pic: string; // PIC of the partner
  sales_id?: string; // Internal Sales responsible for this partner/client
  nama_sales?: string; // Cache for the name of the internal sales
  jabatan: string;
  no_hp: string;
  catatan: string;
  brand_utama: string;
  fokus_produk: string[];
  status_kemitraan?: "Mitra Aktif" | "Calon Mitra" | "Target";
  list_produk_kompetitor?: string[];
  value_kompetitor?: string;
}

export interface ProductData {
  id: string;
  nama: string;
  kategori: string;
  brand: string;
  target_bulanan: number;
  tercapai: number;
  harga_satuan: number;
  harga_normal?: number;
  harga_dasar?: number;
  harga_promo?: number;
  deskripsi?: string;
  spesifikasi?: string[];
  images?: string[];
}

export interface TransactionItem {
  product_id: string;
  jumlah_unit: number;
  harga_satuan?: number;
}

export interface TransactionData {
  id: string;
  tanggal: string;
  partner_id: string;
  sales_id?: string;
  product_id?: string; // Kept for backwards compatibility
  jumlah_unit?: number; // Kept for backwards compatibility 
  items?: TransactionItem[];
  total_harga: number;
  status: "Selesai" | "Proses" | "Batal";
  jenis_pembelian?: "Full Payment" | "Sewa" | "Termin" | "Trial" | "Konsinyasi" | string;
}
