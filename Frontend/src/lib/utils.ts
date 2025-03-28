import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'react-toastify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const displayError = (message: string) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,  
    hideProgressBar: false,
    closeButton: true, 
    pauseOnHover: true, 
    draggable: true, 
    style: {
      backgroundColor: "black",  
      color: "#fff",
      fontSize: "16px",  
      borderRadius: "8px", 
      padding: "15px", 
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
    },
    progressStyle: {
      backgroundColor: "#FF5722",  // Different progress bar color
    },
    
  });
};

export const extractErrorMessage = (message: string): string => {

  const simplifiedMessage = message
    .replace(/<[^>]*>/g, "")  // Remove HTML tags
    .replace(/&[^;]+;/g, "")  // Remove HTML entities
    .replace(/\s+/g, " ")     // Replace multiple spaces with a single space
    .trim();                  // Trim any leading or trailing whitespace
  
  // Optionally, limit the message length to a maximum (e.g., 150 characters)
  return simplifiedMessage.length > 150 ? simplifiedMessage.split(/\s+at\s/)[0] + '...' : simplifiedMessage.split(/\s+at\s/)[0];

}