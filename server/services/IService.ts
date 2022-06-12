export interface IService<T> {
   findAll(): Promise<T[]>;
   save(...args: any): Promise<T>;
   findById(id: number): Promise<T | null>;
   deleteById(id: number): Promise<T>;
   update(data: Partial<T>, id: number): Promise<T>;
}
