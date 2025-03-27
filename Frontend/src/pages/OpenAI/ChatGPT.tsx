import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLLMResponse, fetchSimilarChunkFromPinecone } from "@/app/apiCalls";
import { Button } from "@/components/ui/button";

const ChatGPT = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const [query, setQuery] = useState<string>(""); 
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()

  // Handle changes in the input field
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      if (fileName) {
        // Fetch similar chunks from Pinecone
        const { queryResponse } = await fetchSimilarChunkFromPinecone(query, fileName);
        const similarChunks = queryResponse.matches.map((match: { metadata: { chunk: any; }; }) => match.metadata.chunk);

        // Fetch response from GPT-4
        const gptResponse = await fetchLLMResponse(query, similarChunks);
        setResponse(gptResponse);
      }
    } catch (error) {
      console.error("Error in ChatGPT:", error);
      setResponse("An error occurred while fetching the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Button onClick={() => navigate('/openai/file')}>Back</Button>
      <h2 className="text-2xl font-bold mb-4">Chat about: {fileName}</h2>

      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        className="w-full p-2 mb-4 border rounded text-black"
        placeholder="Type your question..."
        disabled={loading} // Disable input while loading
      />

      <button
        onClick={handleSubmit}
        className={`p-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Loading..." : "Send"}
      </button>

      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="font-semibold text-black">GPT's Response:</h3>
          <p className="text-black">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatGPT;
