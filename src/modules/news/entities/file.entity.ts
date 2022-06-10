import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { News } from './news.entity';
@Entity()
export class FilesNews{
    @PrimaryGeneratedColumn('increment')
    id:number
    @Column()
    fileName:string
    @CreateDateColumn()
    createAt:Date
    @UpdateDateColumn()
    updateAt:Date
    @ManyToOne(type=>News,news=> news.files,{ cascade: true, onDelete: "CASCADE" })
    news:News
}