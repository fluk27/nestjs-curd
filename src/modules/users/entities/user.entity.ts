import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
  readonly  id:string
    @Column()
    firstName:string
    @Column()
    lastName:string
}
