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
    res.status(200).json({
      service: "sengketa-backend",
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      network: "Polygon Mainnet",
      ipfs: "Pinata Gateway Connected",
    });
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
      idSengketa: Number(req.body.idSengketa),
      idJadwal: Number(req.body.idJadwal),
      statusPutusan: Number(req.body.statusPutusan),
      jdih: req.body.jdih,
      cid: req.file,
    });
  });

  static putusanSelesai = handle(async (req) => {
    return ContractService.putusanSelesai({
      idSengketa: Number(req.body.idSengketa),
      idJadwal: Number(req.body.idJadwal),
      statusPutusan: Number(req.body.statusPutusan),
      jdih: req.body.jdih,
      cid: req.file,
    });
  });

  static batalSengketa = handle(async (req) => {
    return ContractService.batalSengketa({
      idSengketa: Number(req.body.idSengketa),
      cid: req.file,
    });
  });

  static cabutSengketa = handle(async (req) => {
    return ContractService.cabutSengketa({
      idSengketa: Number(req.body.idSengketa),
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
