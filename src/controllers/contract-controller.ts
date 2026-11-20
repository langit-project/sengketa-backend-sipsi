import { Request, Response, NextFunction } from "express";
import { ContractService } from "../services/contract-service";
import { PinataService } from "../services/pinata-service";
import {
  MenerimaSengketa,
  ValidasiSengketa,
  PembuatanSidangAwal,
  TambahSidang,
  TambahPutusan,
  RequestBatalCabut,
  InputIdSengketa,
  InputIdSengketaJadwal,
  StructCid,
} from "../models/contract-model";

export class ContractController {
  /**
   * @swagger
   * /contracts/menerima-sengketa:
   *   post:
   *     summary: Menerima Sengketa
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MenerimaSengketa'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async menerimaSengketa(req: Request, res: Response, next: NextFunction) {
    try {
      const request: MenerimaSengketa = req.body as MenerimaSengketa;
      const response = await ContractService.menerimaSengketa(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/validasi-sengketa:
   *   post:
   *     summary: Validasi Sengketa
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ValidasiSengketa'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async validasiSengketa(req: Request, res: Response, next: NextFunction) {
    try {
      const request: ValidasiSengketa = req.body as ValidasiSengketa;
      const response = await ContractService.validasiSengketa(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/pembuatan-jadwal-sidang-awal:
   *   post:
   *     summary: Pembuatan Jadwal Sidang Awal
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PembuatanSidangAwal'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async pembuatanJadwalSidangAwal(req: Request, res: Response, next: NextFunction) {
    try {
      const request: PembuatanSidangAwal = req.body as PembuatanSidangAwal;
      const response = await ContractService.pembuatanJadwalSidangAwal(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/tambah-sidang:
   *   post:
   *     summary: Tambah Sidang
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TambahSidang'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async tambahSidang(req: Request, res: Response, next: NextFunction) {
    try {
      const request: TambahSidang = req.body as TambahSidang;
      const response = await ContractService.tambahSidang(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/tambah-putusan:
   *   post:
   *     summary: Tambah Putusan
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               idSengketa:
   *                 type: string
   *               idJadwal:
   *                 type: string
   *               statusPutusan:
   *                 type: string
   *               cid:
   *                 type: string
   *                 format: binary
   *                 description: PDF file (optional)
   *               jdih:
   *                 type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async tambahPutusan(req: Request, res: Response, next: NextFunction) {
    try {
      const { idSengketa, idJadwal, statusPutusan, jdih } = req.body;
      const cid = req.file; // `cid` is the file uploaded

      const request: TambahPutusan = {
        idSengketa,
        idJadwal,
        statusPutusan,
        cid,
        jdih,
      };
      const response = await ContractService.tambahPutusan(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/putusan-selesai:
   *   post:
   *     summary: Putusan Selesai
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               idSengketa:
   *                 type: string
   *               idJadwal:
   *                 type: string
   *               statusPutusan:
   *                 type: string
   *               cid:
   *                 type: string
   *                 format: binary
   *                 description: PDF file (optional)
   *               jdih:
   *                 type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async putusanSelesai(req: Request, res: Response, next: NextFunction) {
    try {
      const { idSengketa, idJadwal, statusPutusan, jdih } = req.body;
      const cid = req.file; // `cid` is the file uploaded

      const request: TambahPutusan = {
        idSengketa,
        idJadwal,
        statusPutusan,
        cid,
        jdih,
      };
      const response = await ContractService.putusanSelesai(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  // TODO: add batal cabut dan pisahkan kedua endpoint
  /**
   * @swagger
   * /contracts/konfirmasi-batal-sengketa:
   *   post:
   *     summary: Membatalkan Sengketa
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               idSengketa:
   *                 type: string
   *               cid:
   *                 type: string
   *                 format: binary
   *                 description: PDF file (optional)
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async batalSengketa(req: Request, res: Response, next: NextFunction) {
    try {
      const request: RequestBatalCabut = {
        idSengketa: req.body.idSengketa,
        cid: req.file,
      };
      const response = await ContractService.batalSengketa(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/konfirmasi-cabut-sengketa:
   *   post:
   *     summary: Membatal atau mencabut Sengketa
   *     tags: [Contracts]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               idSengketa:
   *                 type: string
   *               cid:
   *                 type: string
   *                 format: binary
   *                 description: PDF file (optional)
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContractResponse'
   *       400:
   *         description: Bad request
   */
  static async cabutSengketa(req: Request, res: Response, next: NextFunction) {
    try {
      const request: RequestBatalCabut = {
        idSengketa: req.body.idSengketa,
        cid: req.file,
      };
      const response = await ContractService.cabutSengketa(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * components:
   *   schemas:
   *     InputIdSengketa:
   *       type: object
   *       properties:
   *         idSengketa:
   *           type: string
   *     InputIdSengketaJadwal:
   *       type: object
   *       properties:
   *         idSengketa:
   *           type: string
   *         idJadwal:
   *           type: string
   *     StructSengketa:
   *       type: object
   *       properties:
   *         pemohon:
   *           type: string
   *         termohon:
   *           type: string
   *     StructSidang:
   *       type: object
   *       properties:
   *         jenis:
   *           type: string
   *         agenda:
   *           type: string
   *         tanggal:
   *           type: string
   *         alamat:
   *           type: string
   *     StructSKPD:
   *       type: object
   *       properties:
   *         jumlah:
   *           type: string
   *         skpd:
   *           type: array
   *           items:
   *             type: string
   */

  /**
   * @swagger
   * /contracts/get-pemohon-Termohon:
   *   post:
   *     summary: Get Pemohon and Termohon
   *     tags: [Get Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InputIdSengketa'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StructSengketa'
   *       500:
   *         description: Server error
   */
  static async getPemohonTermohon(req: Request, res: Response, next: NextFunction) {
    try {
      const request: InputIdSengketa = req.body as InputIdSengketa;
      const result = await ContractService.getPemohonTermohon(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/get-sidang:
   *   post:
   *     summary: Get Sidang details
   *     tags: [Get Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InputIdSengketaJadwal'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StructSidang'
   *       500:
   *         description: Server error
   */
  static async getSidang(req: Request, res: Response, next: NextFunction) {
    try {
      const request: InputIdSengketaJadwal = req.body as InputIdSengketaJadwal;
      const result = await ContractService.getSidang(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/get-dokumen:
   *   post:
   *     summary: Get Dokumen
   *     tags: [Get Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InputIdSengketaJadwal'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *       404:
   *         description: Not Found
   *       500:
   *         description: Server error
   */
  static async getDokumen(req: Request, res: Response, next: NextFunction) {
    try {
      const request: InputIdSengketaJadwal = req.body as InputIdSengketaJadwal;
      const result: StructCid = (await ContractService.getDokumen(request)) as StructCid;
      if (result.attributes.fileHash) {
        const filename = result.name;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", result.attributes.mimetype || "application/octet-stream");
        // Get the file content from Pinata gateway
        const fileContent = await PinataService.getFileContent(result.attributes.fileHash);
        res.end(fileContent);
      } else {
        res.status(404).send("File hash not found");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/get-dokumen-batal-cabut:
   *   post:
   *     summary: Get Dokumen
   *     tags: [Get Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InputIdSengketa'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *       404:
   *         description: Not Found
   *       500:
   *         description: Server error
   */
  static async getDokumenBatalCabut(req: Request, res: Response, next: NextFunction) {
    try {
      const request: InputIdSengketa = req.body as InputIdSengketa;
      const result: StructCid = (await ContractService.getDokumenBatalCabut(request)) as StructCid;

      if (result.attributes.fileHash) {
        const filename = result.name;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", result.attributes.mimetype || "application/octet-stream");
        // Get the file content from Pinata gateway
        const fileContent = await PinataService.getFileContent(result.attributes.fileHash);
        res.end(fileContent);
      } else {
        res.status(404).send("File hash not found");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  /**
   * @swagger
   * /contracts/get-jdih:
   *   post:
   *     summary: Get JDIH
   *     tags: [Get Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InputIdSengketaJadwal'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *       500:
   *         description: Server error
   */
  static async getJDIH(req: Request, res: Response, next: NextFunction) {
    try {
      const request: InputIdSengketaJadwal = req.body as InputIdSengketaJadwal;
      const result = await ContractService.getJDIH(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/get-skpd:
   *   post:
   *     summary: Get SKPD
   *     tags: [Get Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InputIdSengketa'
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StructSKPD'
   *       500:
   *         description: Server error
   */
  static async getSKPD(req: Request, res: Response, next: NextFunction) {
    try {
      const request: InputIdSengketa = req.body as InputIdSengketa;
      const result = await ContractService.getSKPD(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/pinata-files:
   *   get:
   *     summary: Get live list of pinned files from Pinata
   *     tags: [Pinata]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of files to return (default 100)
   *     responses:
   *       200:
   *         description: List of pinned IPFS files
   *       500:
   *         description: Server error
   */
  static async getPinataFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const result = await PinataService.listPins(limit, offset);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /contracts/pinata-explorer:
   *   get:
   *     summary: Realtime interactive web explorer for Pinata IPFS files
   *     tags: [Pinata]
   *     responses:
   *       200:
   *         description: HTML page of Pinata Explorer
   */
  static async pinataExplorer(req: Request, res: Response, next: NextFunction) {
    try {
      const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pinata IPFS Live Explorer - Sengketa Documents</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    h1 { font-size: 24px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
    p.subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
    .btn-refresh { padding: 10px 18px; border-radius: 8px; background: #0284c7; color: white; border: none; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
    .btn-refresh:hover { background: #0369a1; }
    .btn-refresh:disabled { opacity: 0.6; cursor: not-allowed; }
    .toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    input[type="text"] { flex: 1; min-width: 250px; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; font-size: 15px; outline: none; transition: border-color 0.2s; }
    input[type="text"]:focus { border-color: #38bdf8; }
    .stats { display: flex; gap: 16px; font-size: 14px; color: #94a3b8; align-items: center; }
    .table-container { background: #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); border: 1px solid #334155; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 14px 16px; background: #1e293b; font-size: 13px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #334155; }
    td { padding: 14px 16px; border-bottom: 1px solid rgba(51, 65, 85, 0.5); font-size: 14px; vertical-align: middle; }
    tr:hover td { background: #243247; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-pdf { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    .badge-json { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .badge-other { background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.4); }
    .hash { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #a5f3fc; background: #083344; padding: 4px 8px; border-radius: 4px; word-break: break-all; }
    a.btn { display: inline-block; padding: 6px 12px; border-radius: 6px; background: #0284c7; color: white; text-decoration: none; font-size: 13px; font-weight: 500; white-space: nowrap; }
    a.btn:hover { background: #0369a1; }
    .loading-state, .empty-state, .error-state { text-align: center; padding: 60px 20px; color: #94a3b8; font-size: 15px; }
    .error-state { color: #f87171; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>📁 Pinata IPFS Live Explorer</h1>
        <p class="subtitle" id="subtitle">Mengambil data terbaru dari Pinata...</p>
      </div>
      <button class="btn-refresh" id="refreshBtn" onclick="loadFiles()">
        <span id="refreshIcon">🔄</span> Segarkan Data
      </button>
    </header>
    
    <div class="toolbar">
      <input type="text" id="searchInput" placeholder="Cari nama file, ekstensi, atau CID hash..." onkeyup="filterTable()" />
      <div class="stats" id="statsCount"></div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 32%">Nama File</th>
            <th style="width: 10%">Tipe</th>
            <th style="width: 10%">Ukuran</th>
            <th style="width: 18%">Tanggal Pin</th>
            <th style="width: 20%">IPFS CID</th>
            <th style="width: 10%">Aksi</th>
          </tr>
        </thead>
        <tbody id="fileTable">
          <tr>
            <td colspan="6" class="loading-state">
              <div class="spinner"></div><br><br>Memuat file real-time dari Pinata IPFS...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    let allRows = [];

    async function loadFiles() {
      const btn = document.getElementById('refreshBtn');
      const table = document.getElementById('fileTable');
      const subtitle = document.getElementById('subtitle');
      const stats = document.getElementById('statsCount');
      
      btn.disabled = true;
      table.innerHTML = '<tr><td colspan="6" class="loading-state"><div class="spinner"></div><br><br>Memuat data terbaru langsung dari Pinata...</td></tr>';
      
      try {
        const res = await fetch('/contracts/pinata-files?limit=1000');
        if (!res.ok) throw new Error('Gagal memuat: HTTP ' + res.status);
        const data = await res.json();
        
        allRows = data.rows || [];
        subtitle.innerText = 'Total Terdaftar: ' + (data.count || allRows.length) + ' file/metadata IPFS';
        stats.innerText = 'Menampilkan: ' + allRows.length + ' item';
        renderRows(allRows);
      } catch (err) {
        table.innerHTML = '<tr><td colspan="6" class="error-state">❌ Terjadi kesalahan saat memuat data: ' + err.message + '</td></tr>';
      } finally {
        btn.disabled = false;
      }
    }

    function renderRows(rows) {
      const table = document.getElementById('fileTable');
      if (!rows.length) {
        table.innerHTML = '<tr><td colspan="6" class="empty-state">Tidak ada file yang cocok.</td></tr>';
        return;
      }

      table.innerHTML = rows.map(r => {
        const name = r.metadata?.name || 'Dokumen Tanpa Nama / JSON Metadata';
        const isPdf = name.toLowerCase().endsWith('.pdf');
        const isJson = r.mime_type === 'application/json' || name.toLowerCase().endsWith('.json');
        const badgeClass = isPdf ? 'badge-pdf' : (isJson ? 'badge-json' : 'badge-other');
        const badgeText = isPdf ? 'PDF' : (isJson ? 'JSON' : (r.mime_type || 'FILE'));
        const sizeKb = (r.size / 1024).toFixed(1) + ' KB';
        const dateStr = new Date(r.date_pinned).toLocaleString('id-ID');
        const cid = r.ipfs_pin_hash;
        const link = 'https://gateway.pinata.cloud/ipfs/' + cid;

        return '<tr>' +
          '<td><strong>' + escapeHtml(name) + '</strong></td>' +
          '<td><span class="badge ' + badgeClass + '">' + badgeText + '</span></td>' +
          '<td>' + sizeKb + '</td>' +
          '<td>' + dateStr + '</td>' +
          '<td><span class="hash">' + cid + '</span></td>' +
          '<td><a class="btn" href="' + link + '" target="_blank" rel="noopener noreferrer">Buka File ↗</a></td>' +
        '</tr>';
      }).join('');
    }

    function filterTable() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allRows.filter(r => {
        const name = (r.metadata?.name || '').toLowerCase();
        const cid = (r.ipfs_pin_hash || '').toLowerCase();
        return name.includes(q) || cid.includes(q);
      });
      renderRows(filtered);
      document.getElementById('statsCount').innerText = 'Menampilkan: ' + filtered.length + ' item';
    }

    function escapeHtml(text) {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    window.onload = loadFiles;
  </script>
</body>
</html>`;
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
    } catch (error) {
      next(error);
    }
  }
}
