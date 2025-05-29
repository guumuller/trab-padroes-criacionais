import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {eager: true})
    categoria?: Categoria;
    @Column("decimal")
    preco?: number;
  }