"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, Calendar, Star } from "lucide-react";

export type SortOption = 
  | "title_asc" 
  | "title_desc" 
  | "date_desc" 
  | "date_asc" 
  | "rating_desc";

interface ColeccionSortProps {
  onSortChange: (value: SortOption) => void;
  value: SortOption;
}

export function ColeccionSort({ onSortChange, value }: ColeccionSortProps) {
  return (
    <Select 
      value={value} 
      onValueChange={(newValue) => onSortChange(newValue as SortOption)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title_asc" className="flex items-center gap-2">
          <ArrowDownAZ className="h-4 w-4" />
          <span>Título A-Z</span>
        </SelectItem>
        <SelectItem value="title_desc" className="flex items-center gap-2">
          <ArrowUpAZ className="h-4 w-4" />
          <span>Título Z-A</span>
        </SelectItem>
        <SelectItem value="date_desc" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Más recientes</span>
        </SelectItem>
        <SelectItem value="date_asc" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Más antiguos</span>
        </SelectItem>
        <SelectItem value="rating_desc" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <span>Mejor valorados</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}