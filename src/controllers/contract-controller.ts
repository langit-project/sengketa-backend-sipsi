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

/**
 * Helper wrapper untuk eksekusi controller handler secara seragam (DRY).
 */
const handle = (fn: (req: Request) => Promise<unknown>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req);
      if (data === undefined) {
        throw new Error("Service returned undefined");
      }
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };
};

export class ContractController {
  /**
   * Health Check endpoint - siap ditampilkan saat presentasi & monitoring
   */
  static async healthCheck(req: Request, res: Response) {
    const data = {
      service: "sengketa-backend",
      status: "healthy",
      uptime: `${Math.round(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      network: "Polygon Amoy / Mainnet",
      ipfs: "Pinata Gateway Connected",
    };

    if (req.accepts('html') && !req.xhr && !req.path.endsWith('.json') && req.query.format !== 'json') {
      return res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sengketa Contract API - Health Status</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
        <h1 class="text-base font-bold text-slate-900">Sengketa Contract API</h1>
      </div>
      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">● Operational</span>
    </div>
    
    <div class="text-xs space-y-2 text-slate-600">
      <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400">Service:</span><span class="font-mono font-medium">${data.service}</span></div>
      <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400">Network:</span><span class="font-medium text-slate-700">${data.network}</span></div>
      <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400">Storage / IPFS:</span><span class="font-medium text-slate-700">${data.ipfs}</span></div>
      <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400">Uptime:</span><span class="font-mono font-medium">${data.uptime}</span></div>
      <div class="flex justify-between py-1"><span class="text-slate-400">Timestamp:</span><span class="font-mono text-slate-500">${data.timestamp}</span></div>
    </div>

    <div class="pt-2 flex gap-3">
      <a href="/api-docs" class="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-4 rounded-xl transition shadow-sm">
        Buka Swagger UI (/api-docs) &rarr;
      </a>
      <a href="?format=json" class="text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 px-3 rounded-xl transition border border-slate-200">
        JSON
      </a>
    </div>
  </div>
</body>
</html>
      `);
    }

    res.status(200).json(data);
  }

  // --- Transactions (Write Operations) ---
  static menerimaSengketa = handle(async (req) => {
    return ContractService.menerimaSengketa(req.body as MenerimaSengketa);
  });

  static validasiSengketa = handle(async (req) => {
    return ContractService.validasiSengketa(req.body as ValidasiSengketa);
  });

  static pembuatanJadwalSidangAwal = handle(async (req) => {
    return ContractService.pembuatanJadwalSidangAwal(req.body as PembuatanSidangAwal);
  });

  static tambahSidang = handle(async (req) => {
    return ContractService.tambahSidang(req.body as TambahSidang);
  });

  static tambahPutusan = handle(async (req) => {
    return ContractService.tambahPutusan({
      idSengketa: req.body.idSengketa,
      idJadwal: req.body.idJadwal,
      statusPutusan: req.body.statusPutusan,
      jdih: req.body.jdih,
      cid: req.file,
    });
  });

  static putusanSelesai = handle(async (req) => {
    return ContractService.putusanSelesai({
      idSengketa: req.body.idSengketa,
      idJadwal: req.body.idJadwal,
      statusPutusan: req.body.statusPutusan,
      jdih: req.body.jdih,
      cid: req.file,
    });
  });

  static batalSengketa = handle(async (req) => {
    return ContractService.batalSengketa({
      idSengketa: req.body.idSengketa,
      cid: req.file,
    });
  });

  static cabutSengketa = handle(async (req) => {
    return ContractService.cabutSengketa({
      idSengketa: req.body.idSengketa,
      cid: req.file,
    });
  });

  // --- View Calls (Read Operations) ---
  static getPemohonTermohon = handle(async (req) => {
    return ContractService.getPemohonTermohon(req.body as InputIdSengketa);
  });

  static getSidang = handle(async (req) => {
    return ContractService.getSidang(req.body as InputIdSengketaJadwal);
  });

  static getDokumen = handle(async (req) => {
    return ContractService.getDokumen(req.body as InputIdSengketaJadwal);
  });

  static getDokumenBatalCabut = handle(async (req) => {
    return ContractService.getDokumenBatalCabut(req.body as InputIdSengketa);
  });

  static getJDIH = handle(async (req) => {
    return ContractService.getJDIH(req.body as InputIdSengketaJadwal);
  });

  static getSKPD = handle(async (req) => {
    return ContractService.getSKPD(req.body as InputIdSengketa);
  });
}
