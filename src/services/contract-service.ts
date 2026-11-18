import {
  admin,
  majelis,
  pantera,
  publicClient,
  sengketAbi,
  sengketaContractAddress,
} from "../config/contract-config";
import {
  ContractResponse,
  GetContractResponse,
  InputIdSengketa,
  InputIdSengketaJadwal,
  MenerimaSengketa,
  PembuatanSidangAwal,
  RequestBatalCabut,
  ResponseBatalCabut,
  ResponseTambahPutusan,
  StructCid,
  StructJdih,
  StructSengketa,
  StructSidang,
  StructSKPD,
  TambahPutusan,
  TambahSidang,
  toContractResponse,
  toGetContractResponse,
  ValidasiSengketa,
} from "../models/contract-model";
import { ContractValidation } from "../validations/contract-validation";
import { Address, WalletClient } from "viem";
import { PinataService } from "./pinata-service";

/**
 * [DISERTASI] Modul Pencatatan Digital Sengketa
 * Mengintegrasikan pencatatan status perkara on-chain Polygon dan penyimpanan bukti terdesentralisasi IPFS Pinata.
 */
export class ContractService {
  private static handleContractError(functionName: string, error: unknown): never {
    console.error(`ContractService.${functionName} failed:`, error instanceof Error ? error.stack || error.message : error);
    throw error;
  }

  /**
   * Helper generik untuk mengeksekusi penulisan smart contract (DRY).
   */
  private static async executeWrite<T>(
    signer: WalletClient,
    functionName: string,
    args: unknown[],
    responseData: T
  ): Promise<ContractResponse<T>> {
    try {
      console.info(`ContractService.${functionName}: writing contract`, {
        address: sengketaContractAddress,
        functionName,
      });

      const tx = await (signer as any).writeContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName,
        args,
      });

      console.info(`ContractService.${functionName}: tx hash`, tx);
      return toContractResponse(responseData, tx);
    } catch (error) {
      ContractService.handleContractError(functionName, error);
    }
  }

  // [DISERTASI] Registrasi penerimaan sengketa on-chain
  static async menerimaSengketa(
    request: MenerimaSengketa
  ): Promise<ContractResponse<MenerimaSengketa> | undefined> {
    const valid = ContractValidation.MENERIMA.parse(request);
    return this.executeWrite(admin, "menerimaSengketa", [valid.idSengketa, valid.pemohon, valid.termohon], request);
  }

  // [DISERTASI] Validasi sengketa & pencatatan SKPD termohon on-chain
  static async validasiSengketa(
    request: ValidasiSengketa
  ): Promise<ContractResponse<ValidasiSengketa> | undefined> {
    const valid = ContractValidation.VALIDASI.parse(request);
    return this.executeWrite(admin, "validasiSengketa", [valid.idSengketa, valid.jumlah, valid.skpd], request);
  }

  // [DISERTASI] Penjadwalan sidang pemeriksaan awal
  static async pembuatanJadwalSidangAwal(
    request: PembuatanSidangAwal
  ): Promise<ContractResponse<PembuatanSidangAwal> | undefined> {
    const valid = ContractValidation.SIDANG_AWAL.parse(request);
    return this.executeWrite(
      pantera,
      "pembuatanSidangPemeriksaanAwal",
      [valid.idSengketa, valid.idJadwal, valid.agenda, valid.tanggal, valid.alamat],
      request
    );
  }

  // [DISERTASI] Pembaruan agenda/jadwal sidang lanjutan
  static async tambahSidang(
    request: TambahSidang
  ): Promise<ContractResponse<TambahSidang> | undefined> {
    const valid = ContractValidation.TAMBAH_SIDANG.parse(request);
    return this.executeWrite(
      pantera,
      "updateSidang",
      [valid.idSengketa, valid.idJadwal, valid.jenis, valid.agenda, valid.tanggal, valid.alamat],
      request
    );
  }

  static async getCID(file: Express.Multer.File | undefined): Promise<string> {
    return PinataService.uploadFile(file);
  }

  // [DISERTASI] Pencatatan putusan sengketa & CID IPFS bukti dokumen
  static async tambahPutusan(
    request: TambahPutusan
  ): Promise<ContractResponse<ResponseTambahPutusan> | undefined> {
    const valid = ContractValidation.TAMBAH_PUTUSAN.parse(request);
    const cid: string = await this.getCID(request.cid);
    const enhancedRequest: ResponseTambahPutusan = {
      idSengketa: valid.idSengketa.toString(),
      idJadwal: valid.idJadwal.toString(),
      statusPutusan: valid.statusPutusan.toString(),
      cid,
      jdih: valid.jdih,
    };
    return this.executeWrite(
      majelis,
      "tambahPutusan",
      [valid.idSengketa, valid.idJadwal, valid.statusPutusan, cid, valid.jdih || ""],
      enhancedRequest
    );
  }

  // [DISERTASI] Finalisasi putusan selesai & hash CID IPFS
  static async putusanSelesai(
    request: TambahPutusan
  ): Promise<ContractResponse<ResponseTambahPutusan> | undefined> {
    const valid = ContractValidation.TAMBAH_PUTUSAN.parse(request);
    const cid: string = await this.getCID(request.cid);
    const enhancedRequest: ResponseTambahPutusan = {
      idSengketa: valid.idSengketa.toString(),
      idJadwal: valid.idJadwal.toString(),
      statusPutusan: valid.statusPutusan.toString(),
      cid,
      jdih: valid.jdih,
    };
    return this.executeWrite(
      majelis,
      "putusanSelesai",
      [valid.idSengketa, valid.idJadwal, valid.statusPutusan, cid, valid.jdih || ""],
      enhancedRequest
    );
  }

  // [DISERTASI] Pembatalan sengketa & pencatatan alasan via CID IPFS
  static async batalSengketa(
    request: RequestBatalCabut
  ): Promise<ContractResponse<ResponseBatalCabut> | undefined> {
    const valid = ContractValidation.BATAL_CABUT.parse(request);
    const cidMetadata: string = await this.getCID(valid.cid);
    const res: ResponseBatalCabut = {
      idSengketa: valid.idSengketa.toString(),
      cid: cidMetadata,
    };
    return this.executeWrite(admin, "batalSengketa", [valid.idSengketa, cidMetadata], res);
  }

  // [DISERTASI] Pencabutan sengketa oleh pemohon & pencatatan CID IPFS
  static async cabutSengketa(
    request: RequestBatalCabut
  ): Promise<ContractResponse<ResponseBatalCabut> | undefined> {
    const valid = ContractValidation.BATAL_CABUT.parse(request);
    const cidMetadata: string = await this.getCID(request.cid);
    const res: ResponseBatalCabut = {
      idSengketa: valid.idSengketa.toString(),
      cid: cidMetadata,
    };
    return this.executeWrite(admin, "cabutSengketa", [valid.idSengketa, cidMetadata], res);
  }

  static async getPemohonTermohon(
    request: InputIdSengketa
  ): Promise<GetContractResponse<StructSengketa>> {
    try {
      const valid = ContractValidation.ID_SENGKETA.parse(request);
      const response = (await publicClient.readContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName: "getPemohonTermohon",
        args: [valid.idSengketa],
      })) as StructSengketa;

      const res: StructSengketa = {
        pemohon: response.pemohon,
        termohon: response.termohon,
      };
      return toGetContractResponse(request, res);
    } catch (error) {
      ContractService.handleContractError("getPemohonTermohon", error);
    }
  }

  static async getSidang(
    request: InputIdSengketaJadwal
  ): Promise<GetContractResponse<StructSidang>> {
    try {
      const valid = ContractValidation.ID_SENGKETA_JADWAL.parse(request);
      const response = (await publicClient.readContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName: "getSidang",
        args: [valid.idSengketa, valid.idJadwal],
      })) as StructSidang;

      const res: StructSidang = {
        jenis: response.jenis.toString(),
        agenda: response.agenda,
        tanggal: response.tanggal.toString(),
        alamat: response.alamat,
      };
      return toGetContractResponse(request, res);
    } catch (error) {
      ContractService.handleContractError("getSidang", error);
    }
  }

  static async getDokumen(request: InputIdSengketaJadwal): Promise<StructCid> {
    try {
      const valid = ContractValidation.ID_SENGKETA_JADWAL.parse(request);
      const response = (await publicClient.readContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName: "getDokumen",
        args: [valid.idSengketa, valid.idJadwal],
      })) as string;

      if (!response) {
        throw new Error("Dokumen not found");
      }
      const metadata = await PinataService.getMetadata(response);
      if (!metadata || !metadata.attributes?.fileHash) {
        throw new Error("Metadata not found or invalid");
      }
      return metadata;
    } catch (error) {
      ContractService.handleContractError("getDokumen", error);
    }
  }

  static async getDokumenBatalCabut(request: InputIdSengketa): Promise<StructCid> {
    try {
      const valid = ContractValidation.ID_SENGKETA.parse(request);
      const response = (await publicClient.readContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName: "getDokumenBatalCabut",
        args: [valid.idSengketa],
      })) as string;

      if (!response) {
        throw new Error("Dokumen not found");
      }
      const metadata = await PinataService.getMetadata(response);
      if (!metadata || !metadata.attributes?.fileHash) {
        throw new Error("Metadata not found or invalid");
      }
      return metadata;
    } catch (error) {
      ContractService.handleContractError("getDokumenBatalCabut", error);
    }
  }

  static async getJDIH(request: InputIdSengketaJadwal): Promise<GetContractResponse<StructJdih>> {
    try {
      const valid = ContractValidation.ID_SENGKETA_JADWAL.parse(request);
      const response = (await publicClient.readContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName: "getJDIH",
        args: [valid.idSengketa, valid.idJadwal],
      })) as unknown;

      let jdihUrl = "";
      if (typeof response === "string") {
        jdihUrl = response;
      } else if (response && typeof response === "object") {
        const chars = Object.entries(response)
          .filter(([key]) => !isNaN(Number(key)))
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([_, value]) => value)
          .join("");
        jdihUrl = chars;
      }

      return toGetContractResponse(request, { jdih: jdihUrl });
    } catch (error) {
      ContractService.handleContractError("getJDIH", error);
    }
  }

  static async getSKPD(request: InputIdSengketa): Promise<GetContractResponse<StructSKPD>> {
    try {
      const valid = ContractValidation.ID_SENGKETA.parse(request);
      const response = (await publicClient.readContract({
        address: sengketaContractAddress as Address,
        abi: sengketAbi,
        functionName: "getSKPD",
        args: [valid.idSengketa],
      })) as StructSKPD;

      const res: StructSKPD = {
        jumlah: response.jumlah.toString(),
        skpd: response.skpd,
      };
      return toGetContractResponse(request, res);
    } catch (error) {
      ContractService.handleContractError("getSKPD", error);
    }
  }
}
