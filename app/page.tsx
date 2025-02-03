"use client";

import { useState, useTransition } from "react";
//import { IRegister0000 } from "./lib/def-icms";
import { GenerateSPEDContributions, LoadInvoiceByModel } from "./actions";

export default function Home() {
  const [file, setFile] = useState("");
  const [data, setData] = useState<string>("");
  const [dataSelected, setDataSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileSelected = event.target.files?.[0];

    if (fileSelected && fileSelected.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // Decodifica primeiro como Windows-1252 (ANSI no Notepad++)
        const fileContent = new TextDecoder("windows-1252").decode(arrayBuffer);

        setFile(fileContent);

        startTransition(async () => {
          const data = await LoadInvoiceByModel(fileContent, "01");
          //console.log("data", data);
          setDataSelected(data);
        });
      };

      reader.readAsArrayBuffer(fileSelected);
    } else {
      alert("Por favor, selecione um arquivo .txt válido.");
    }
  }

  async function handleGenerateSPEDContributions(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    startTransition2(async () => {
      const fileSPED = await GenerateSPEDContributions(file, "01");
      const newFile = fileSPED.join("\n");

      const blob = new Blob([newFile], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "SPED Contribuicoes.txt"; // Nome do arquivo

      // Acionando o clique para download
      document.body.appendChild(link);
      link.click();

      // Removendo o link após o uso
      document.body.removeChild(link);

      //console.log(newFile);
      setData(newFile);
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        <p>Arquivo do SPED ICMS:</p>
        <input type="file" accept="text/plain" onChange={handleFileChange} />
        <p>{isPending && "Carregando..."}</p>
      </div>
      <div className="mb-5 border-b">
        <p className="mt-5 border-b font-bold">Resumo do arquivo</p>
        <p>
          Empresa: {dataSelected.length > 0 && dataSelected[0].split("|")[6]}
        </p>
        <p>
          Período:
          {dataSelected.length > 0 &&
            " " +
              dataSelected[0].split("|")[4] +
              " - " +
              dataSelected[0].split("|")[5]}
        </p>
        <p>
          Quantidade de nota:{" "}
          {dataSelected.length > 0 && dataSelected.length - 1}
        </p>
      </div>
      <button
        onClick={handleGenerateSPEDContributions}
        className="border p-2 bg-slate-100 hover:bg-slate-50"
      >
        {isPending2 ? "Aguarde..." : "Gerar SPED Contribuições"}
      </button>
      <textarea
        defaultValue={data}
        className="min-h-72 border mt-2 text-nowrap"
      />
    </div>
  );
}
