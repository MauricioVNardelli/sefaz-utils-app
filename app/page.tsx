"use client";

import { useState, useTransition } from "react";
//import { IRegister0000 } from "./lib/def-icms";
import { GenerateSPEDContributions, LoadInvoiceByModel } from "./actions";

export default function Home() {
  const [file, setFile] = useState("");
  const [data, setData] = useState<string>("");
  const [dataC100, setDataC100] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileSelected = event.target.files?.[0];

    if (fileSelected && fileSelected.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string; // Lê o conteúdo do arquivo
        setFile(fileContent);

        startTransition(async () => {
          const data = await LoadInvoiceByModel(fileContent, "01");
          //console.log("data", data);
          setDataC100(data);
        });
      };

      reader.readAsText(fileSelected, "UTF-8");
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
      <input type="file" accept="text/plain" onChange={handleFileChange} />
      <p>{isPending && "Carregando..."}</p>
      <p>Quantidade de nota: {dataC100.length}</p>
      <button
        onClick={handleGenerateSPEDContributions}
        className="border p-2 bg-slate-100"
      >
        {isPending2 ? "Aguarde..." : "Gerar SPED Contribuições"}
      </button>
      <textarea
        defaultValue={data}
        className="min-h-40 border mt-2 text-nowrap"
      />
    </div>
  );
}
