import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from '../../users/entities/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id:string
    @Column()
    title:string
    @Column()
    description:string
    @CreateDateColumn()
    created:Date
    @UpdateDateColumn()
    updated:Date
    @ManyToOne(type=>Users,user=>user.task)
    users:Users
}
