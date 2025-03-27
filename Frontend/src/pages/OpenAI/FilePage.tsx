import { fetchAllFilesFromDB, getFileCreateEmbeddingStoreInPinecone } from "@/app/apiCalls";
import AddFileModal from "@/components/modals/AddFileModal";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FilePage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<String[]>([]);

  const addFileHandle = async (filePath: string, fileName: string) => {
    try {
      const newFile = await getFileCreateEmbeddingStoreInPinecone(filePath, fileName);
      setFiles([newFile.fileName, ...files]);
    } catch (error) {
      console.error("Error occurred in addFileHandle", error);
    }
  };

  const chatWithGPT = (fileName: String) => {
    console.log(`Chat with GPT about: ${fileName}`);
    navigate(`/openai/chatgpt/${fileName}`)
  };

  useEffect(() => {
    const fetchData = async () => {
      const files = await fetchAllFilesFromDB();
      setFiles(files.fileNames);
    };
    fetchData();
  }, []);

  return (
    <>
      <Button variant="outline" className="m-3" onClick={() => navigate(`/`)}>
        Back To Stuconnect
      </Button>
      <AddFileModal onAddFile={addFileHandle} />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Files</h2>
        <div className="flex gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              onClick={() => chatWithGPT(file)}
              className="h-20 w-40 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition cursor-pointer border-2 border-white p-4"
            >
              <h1 className="font-semibold text-xl text-center text-white">{file}</h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilePage;
