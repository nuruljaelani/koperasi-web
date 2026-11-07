# 📱 WhatsApp Gateway API Documentation

Dokumentasi sederhana dan praktis untuk menggunakan layanan WhatsApp Gateway pada `notif-service`.

---

## 🔑 1. Autentikasi

Semua endpoint WhatsApp dilindungi oleh **API Key**. Pastikan menyertakan key ini di setiap request melalui salah satu header berikut:

| Header | Contoh Nilai | Keterangan |
| :--- | :--- | :--- |
| `X-API-Key` | `your-secure-internal-api-key` | Direkomendasikan |
| `Authorization` | `Bearer your-secure-internal-api-key` | Alternatif format Bearer |

> Nilai API key diatur melalui variabel lingkungan `INTERNAL_API_KEY` di file `.env`.

---

## 🌐 2. Base URL & Format Nomor

- **Base URL:** `http://localhost:8081` *(sesuaikan dengan `HTTP_HOST` & `HTTP_PORT`)*
- **Format Nomor Telepon (`phone`):**
  - Bisa menggunakan awalan `08...`, `628...`, atau `+628...` (karakter non-digit otomatis dibersihkan).
  - Sistem otomatis mengonversi awalan `0` menjadi `62` (contoh: `081234567890` → `6281234567890@s.whatsapp.net`).
  - Panjang nomor: 8 – 20 digit.
- **Batas Panjang Pesan (`message`):** Maksimal 4096 karakter.

---

## 🚀 3. Alur Cepat Penggunaan (Quickstart)

```
1. Cek Status Device  ──►  2. Scan QR di Browser  ──►  3. Kirim Pesan
(GET /api/devices)         (GET /api/devices/{id}/qr)     (POST /api/send)
```

1. Buka browser: `http://localhost:8081/api/devices/default/qr` (gunakan ekstensi header atau buka saat device belum login).
2. Buka aplikasi **WhatsApp di ponsel** > **Perangkat Tertaut** > **Tautkan Perangkat**.
3. Arahkan kamera ponsel ke QR Code yang muncul di layar.
4. Setelah terhubung, device siap mengirim pesan!

---

## 📚 4. Daftar Endpoint API

### A. Pengiriman Pesan (Send Message)

#### 1. Kirim Pesan Umum
Mengirim pesan menggunakan device tertentu, atau otomatis memilih device `default` jika `device_id` tidak diisi.

- **Method:** `POST`
- **URL:** `/api/send`
- **Headers:**
  ```http
  X-API-Key: your-secure-internal-api-key
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "device_id": "default",
    "phone": "081234567890",
    "message": "Halo! Pesanan Anda #12345 sedang diproses."
  }
  ```
  *(Catatan: field `device_id` bersifat opsional)*

- **Response Sukses (`200 OK`):**
  ```json
  {
    "success": true,
    "device_id": "default",
    "phone": "081234567890",
    "message": "message sent successfully"
  }
  ```

---

#### 2. Kirim Pesan dari Device Tertentu
Mengirim pesan secara eksplisit menggunakan ID device tertentu.

- **Method:** `POST`
- **URL:** `/api/devices/{id}/send`
- **Request Body:**
  ```json
  {
    "phone": "081234567890",
    "message": "Kode OTP Anda adalah: 849201. Berlaku selama 5 menit."
  }
  ```
- **Response Sukses (`200 OK`):**
  ```json
  {
    "success": true,
    "device_id": "default",
    "phone": "081234567890",
    "message": "message sent successfully"
  }
  ```

---

### B. Manajemen Perangkat (Device Management)

Layanan ini mendukung multi-device (bisa menghubungkan lebih dari 1 nomor WhatsApp).

#### 1. Daftar Semua Perangkat
- **Method:** `GET`
- **URL:** `/api/devices`
- **Response Sukses (`200 OK`):**
  ```json
  {
    "devices": [
      {
        "id": "default",
        "name": "Default Device",
        "jid": "6281234567890@s.whatsapp.net",
        "connected": true,
        "logged_in": true,
        "has_qr": false,
        "created_at": "2026-10-23T10:00:00Z"
      }
    ]
  }
  ```

---

#### 2. Tambah Perangkat Baru
- **Method:** `POST`
- **URL:** `/api/devices`
- **Request Body:**
  ```json
  {
    "id": "cs-tokova",
    "name": "Customer Support WhatsApp"
  }
  ```
- **Response Sukses (`201 Created`):**
  ```json
  {
    "id": "cs-tokova",
    "name": "Customer Support WhatsApp",
    "status": "pairing",
    "qr_url": "/api/devices/cs-tokova/qr",
    "message": "Device registered. Scan the QR code to pair."
  }
  ```

---

#### 3. Cek Status Perangkat Tertentu
- **Method:** `GET`
- **URL:** `/api/devices/{id}` atau `/api/devices/{id}/status`
- **Response Sukses (`200 OK`):**
  ```json
  {
    "id": "cs-tokova",
    "name": "Customer Support WhatsApp",
    "jid": "6281234567890@s.whatsapp.net",
    "connected": true,
    "logged_in": true,
    "has_qr": false,
    "created_at": "2026-10-23T10:00:00Z"
  }
  ```

---

#### 4. Dapatkan QR Code Pairing
Endpoint ini memiliki dua mode tampilan:

##### Mode Tampilan Browser (HTML Auto-Refresh)
Buka langsung di browser:
- **URL:** `GET /api/devices/{id}/qr`
- Menampilkan halaman web interaktif dengan gambar QR code yang me-refresh otomatis setiap 6 detik sampai Anda berhasil melakukan scan. Jika sudah login, menampilkan status terhubung.

##### Mode API / JSON
- **URL:** `GET /api/devices/{id}/qr?format=json`  
  *(atau sertakan header `Accept: application/json`)*
- **Response Sukses (`200 OK`):**
  ```json
  {
    "status": "ready",
    "qr_code": "2@qwert...",
    "qr_png_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
  }
  
##### Mode Realtime Stream (Server-Sent Events / SSE) ⭐ *(Direkomendasikan untuk Modal Frontend)*
- **URL:** `GET /api/devices/{id}/qr/stream` *(dapat menyertakan `?api_key=your-key` jika menggunakan `EventSource` bawaan browser)*
- **Headers:** `Accept: text/event-stream`
- **Tipe Event yang Dikirim:**
  - `status: "waiting"`: Saat menunggu inisialisasi QR.
  - `status: "qr"`: Saat QR code tersedia atau berganti (disertai `qr_code` dan `qr_png_base64`).
  - `status: "connected"`: Saat ponsel berhasil memindai QR dan login sukses.
  - `status: "timeout"`: Jika sesi pairing kedaluwarsa.
- **Contoh Payload Event:**
  ```json
  data: {"status":"qr","qr_code":"2@abc...","qr_png_base64":"iVBORw0KGgo..."}
  ```
  ```json
  data: {"status":"connected","jid":"6281234567890@s.whatsapp.net","message":"WhatsApp device paired and logged in successfully!"}
  ```

---

#### 5. Dapatkan Gambar QR Code Mentah (PNG)
- **Method:** `GET`
- **URL:** `/api/devices/{id}/qr.png`
- **Response:** File gambar berformat `image/png`. Cocok digunakan pada tag `<img src="...">` di dashboard admin.

---

#### 6. Memicu Pairing Ulang
Jika QR code kadaluarsa atau koneksi terputus dan ingin generate QR baru:
- **Method:** `POST`
- **URL:** `/api/devices/{id}/pair`
- **Response Sukses (`200 OK`):**
  ```json
  {
    "message": "pairing initiated",
    "qr_url": "/api/devices/default/qr"
  }
  ```

---

#### 7. Logout Perangkat
Memutuskan koneksi WhatsApp dari nomor yang terhubung:
- **Method:** `POST`
- **URL:** `/api/devices/{id}/logout`
- **Response Sukses (`200 OK`):**
  ```json
  {
    "message": "device logged out successfully"
  }
  ```

---

#### 8. Hapus Perangkat
Menghapus perangkat dari database beserta seluruh kredensial sesi:
- **Method:** `DELETE`
- **URL:** `/api/devices/{id}`
- **Response Sukses (`200 OK`):**
  ```json
  {
    "message": "device deleted successfully"
  }
  ```

---

## 🛠️ 5. Contoh Request Menggunakan cURL

### 1. Cek Daftar Device
```bash
curl -X GET http://localhost:8081/api/devices \
  -H "X-API-Key: your-secure-internal-api-key"
```

### 2. Kirim Pesan Teks
```bash
curl -X POST http://localhost:8081/api/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-internal-api-key" \
  -d '{
    "phone": "081234567890",
    "message": "Halo dari Tokova! Pesanan Anda telah dikirim."
  }'
```

### 3. Logout Device
```bash
curl -X POST http://localhost:8081/api/devices/default/logout \
  -H "X-API-Key: your-secure-internal-api-key"
```

---

## ⚠️ 6. Format Response Error

Jika terjadi error, API akan mengembalikan status HTTP error (`400`, `401`, `404`, `500`) dengan format JSON:

```json
{
  "error": "phone and message are required"
}
```

### Kode Status Umum:
| HTTP Status | Arti | Penyebab Umum |
| :--- | :--- | :--- |
| `401 Unauthorized` | Autentikasi Gagal | `X-API-Key` salah atau tidak disertakan |
| `400 Bad Request` | Permintaan Tidak Valid | Field `phone` / `message` kosong, ID tidak valid, atau pesan > 4096 char |
| `404 Not Found` | Data Tidak Ditemukan | Device ID yang dituju tidak terdaftar |
| `409 Conflict` | Konflik Data | Device ID sudah pernah didaftarkan |
| `500 Internal Server Error` | Gangguan Server / WA | Device belum terhubung / HP tidak aktif saat mengirim |
