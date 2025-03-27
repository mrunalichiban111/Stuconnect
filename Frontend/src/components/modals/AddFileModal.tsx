import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddFileModalProps {
  onAddFile: (filePath: string, fileName: string) => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onAddFile }) => {
  const [filePath, setFilePath] = useState("");
  const [customFileName, setCustomFileName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFile = () => {
    if (filePath && customFileName) {
      // Add extra backslashes
      const formattedFilePath = filePath.replace(/\\/g, "\\\\");
      onAddFile(formattedFilePath, customFileName);

      // Clear state
      setFilePath("");
      setCustomFileName("");

      // Close modal
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Add File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New File</DialogTitle>
          <DialogDescription>
            Enter the file path and specify a custom name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filePath" className="text-right">
              File Path
            </Label>
            <Input
              id="filePath"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Enter the file path"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customFileName" className="text-right">
              Custom File Name
            </Label>
            <Input
              id="customFileName"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="Enter a custom file name"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddFile}>
            Add File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileModal;
