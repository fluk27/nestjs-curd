import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from "typeorm"
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
}
