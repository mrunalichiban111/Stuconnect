import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Users } from "lucide-react";
import ManageMembersItem from "@/components/navigation/ManageMembersItem";

interface ManageMembersProps {
    isOpen: boolean;
    onClose: () => void;
}

const ManageMembers = ({ isOpen, onClose }: ManageMembersProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="dark:bg-[#2B2D31]">
        <SheetHeader>
          <SheetTitle className="flex">
            Members
            <Users className="ml-3"/>
          </SheetTitle>
          <SheetDescription>
            View & Manage Members.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
            <ManageMembersItem/>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ManageMembers
