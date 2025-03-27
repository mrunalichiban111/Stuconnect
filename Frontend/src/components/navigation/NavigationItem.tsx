import ActionTooltip from "@/components/ActionTooltip";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

interface NavigationItemProps {
    id: string;
    image: string;
    name: string;
}

const NavigationItem = ({ id, image, name }: NavigationItemProps) => {
    const params = useParams();
    const navigate = useNavigate()
    const handleOnClick = () => {
        navigate(`/servers/${id}`)
    }
    
    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={handleOnClick} className="group relative flex items-center">
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.id !== id && "group-hover:h-[20px]",
                    params?.id === id ? "h-[36px]" : "h-[8px]"
                )} />
                <div className={cn(
                    "relative flex items-center justify-center h-[48px] w-[48px] mx-3 rounded-full overflow-hidden transition-all",
                    params?.id === id ? "bg-primary/10 text-primary" : "bg-background dark:bg-neutral-700",
                    "group-hover:rounded-[16px]"
                )}>
                    <img src={image} className="w-full h-full object-cover" />
                </div>
            </button>
        </ActionTooltip>
    );
}

export default NavigationItem;
