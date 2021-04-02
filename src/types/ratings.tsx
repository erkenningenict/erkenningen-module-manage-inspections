export type ICategory = {
  id: string;
  categoryName: string;
  weighing: number;
  rating: number; // cijfer
  total: number; // totaal
  questions: IRatingQuestion[];
  version: string;
  date: Date;
};

export type IRatingQuestion = {
  id: string;
  categoryId?: string;
  name: string;
  weighing: number;
  rating: number;
  total: number;
  version: string;
  date: Date;
  remark?: string;
};
