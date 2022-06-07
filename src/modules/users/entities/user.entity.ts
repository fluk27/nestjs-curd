import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn, OneToMany } from "typeorm"
import { Task } from '../../tasks/entities/task.entity';
@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
  readonly  id:string
  @Column()
  username:string
    @Column()
    password:string
    @Column()
    firstName:string
    @Column()
    lastName:string
    @Column()
    isActive:boolean
    @CreateDateColumn()
    createDate:Date
    @UpdateDateColumn()
    update:Date
    @OneToMany(type=>Task,task=>task.users)
    task:Task
}
