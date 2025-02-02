"use server";

const indexFieldC100 = {
  register: 1,
  ind_oper: 2,
  ind_emit: 3,
  cod_part: 4,
  cod_mod: 5,
  cod_sit: 6,
  ser: 7,
  num_doc: 8,
  chv_nfe: 9,
  dt_doc: 10,
  dt_e_s: 11,
  vl_doc: 12,
  ind_pgto: 13,
  vl_desc: 14,
  vl_abat_nt: 15,
  vl_merc: 16,
  vl_pis: 26,
  vl_cofins: 27,
};

const indexFieldC170 = {
  NUM_ITEM: 2,
  COD_ITEM: 3,
  DESCR_COMPL: 4,
  VL_ITEM: 7,
  VL_DESC: 8,
  CST_PIS: 25,
  VL_BC_PIS: 26,
  ALIQ_PIS: 27,
  VL_PIS: 30,
  CST_COFINS: 31,
  VL_BC_COFINS: 32,
  ALIQ_COFINS: 29,
  VL_COFINS: 36,
  COD_CTA: 37,
};

const indexField0000 = {
  COD_FIN: 3,
  DT_INI: 4,
  DT_FIN: 5,
  NOME: 6,
  CNPJ: 7,
  UF: 9,
  COD_MUN: 11,
  SUFRAMA: 13,
  IND_ATIV: 15,
};

export async function LoadInvoiceByModel(prFile: string, prModel: string) {
  const file = prFile.split("\n");
  const invoices = [];

  for (let i = 0; i < file.length; i++) {
    const values = file[i].split("|");

    if (
      values[indexFieldC100.register] == "C100" &&
      values[indexFieldC100.cod_mod] == prModel
    ) {
      invoices.push(file[i]);
    }
  }

  return invoices;
}

export async function GenerateSPEDContributions(
  prFile: string,
  prModel: string
): Promise<string[]> {
  const file = prFile.split("\n");
  let isInvoceModel = false;
  const notasSpedContrib = [];

  for (let i = 0; i < file.length; i++) {
    const values = file[i].split("|");

    if (values[1] == "0000") {
      notasSpedContrib.push(getLine0000From0000(values));
    }

    if (values[1] == "0001" || values[1] == "0100" || values[1] == "0150") {
      notasSpedContrib.push(file[i]);
    }

    if (values[1] == "0200") {
      let register0200 = "|";

      for (let i = 1; i < values.length - 2; i++)
        register0200 += values[i] + "|";

      notasSpedContrib.push(register0200);
    }

    if (values[1] == "C100" && values[indexFieldC100.cod_mod] !== prModel)
      isInvoceModel = false;

    if (values[1] == "C100" && values[indexFieldC100.cod_mod] == prModel) {
      notasSpedContrib.push(getLineA100FromC100(values));

      isInvoceModel = true;
    }

    if (isInvoceModel && values[1] == "C170") {
      notasSpedContrib.push(getLineA170FromC170(values));
    }
  }

  return notasSpedContrib;
}

function getLineA100FromC100(prLineC100: string[]): string {
  const registerA100 = "|A100|".concat(
    prLineC100[indexFieldC100.ind_oper],
    "|",
    prLineC100[indexFieldC100.ind_emit],
    "|",
    prLineC100[indexFieldC100.cod_part],
    "|",
    prLineC100[indexFieldC100.cod_sit],
    "|",
    prLineC100[indexFieldC100.ser],
    "|",
    "",
    "|",
    prLineC100[indexFieldC100.num_doc],
    "|",
    prLineC100[indexFieldC100.chv_nfe],
    "|",
    prLineC100[indexFieldC100.dt_doc],
    "|",
    prLineC100[indexFieldC100.dt_e_s],
    "|",
    prLineC100[indexFieldC100.vl_doc],
    "|",
    prLineC100[indexFieldC100.ind_pgto],
    "|",
    prLineC100[indexFieldC100.vl_desc],
    "|",
    prLineC100[indexFieldC100.vl_doc],
    "|",
    prLineC100[indexFieldC100.vl_pis],
    "|",
    prLineC100[indexFieldC100.vl_doc],
    "|",
    prLineC100[indexFieldC100.vl_cofins],
    "|",
    "",
    "|",
    "",
    "|",
    "|",
    "|"
  );

  return registerA100;
}

function getLineA170FromC170(prLineC170: string[]): string {
  const registerA170 = "|A170|".concat(
    prLineC170[indexFieldC170.NUM_ITEM] + "|",
    prLineC170[indexFieldC170.COD_ITEM] + "|",
    prLineC170[indexFieldC170.DESCR_COMPL] + "|",
    prLineC170[indexFieldC170.VL_ITEM] + "|",
    "" + "|",
    "" + "|",
    prLineC170[indexFieldC170.CST_PIS] + "|",
    prLineC170[indexFieldC170.VL_BC_PIS] + "|",
    prLineC170[indexFieldC170.ALIQ_PIS] + "|",
    prLineC170[indexFieldC170.VL_PIS] + "|",
    prLineC170[indexFieldC170.CST_COFINS] + "|",
    prLineC170[indexFieldC170.VL_BC_COFINS] + "|",
    prLineC170[indexFieldC170.ALIQ_COFINS] + "|",
    prLineC170[indexFieldC170.VL_COFINS] + "|",
    prLineC170[indexFieldC170.COD_CTA] + "|",
    "|"
  );

  return registerA170;
}

function getLine0000From0000(prLine0000: string[]): string {
  const register0000 = "|0000|".concat(
    "006|",
    "0|",
    "|",
    "|",
    prLine0000[indexField0000.DT_INI] + "|",
    prLine0000[indexField0000.DT_FIN] + "|",
    prLine0000[indexField0000.NOME] + "|",
    prLine0000[indexField0000.CNPJ] + "|",
    prLine0000[indexField0000.UF] + "|",
    prLine0000[indexField0000.COD_MUN] + "|",
    prLine0000[indexField0000.SUFRAMA] + "|",
    "00" + "|",
    prLine0000[indexField0000.IND_ATIV] + "|"
  );

  return register0000;
}
