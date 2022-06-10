import { Column, CreateDateColumn, Entity, OneToMany,JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FilesNews } from './file.entity';
@Entity()
export class News {
    @PrimaryGeneratedColumn('increment')
    id:number
    @Column()
    title:string
    @Column()
    subtitle:string
    @Column()
    detail:string
    @Column()
    isPublish:Boolean
    @Column()
    publish_at_start: Date;
    @Column()
    publish_at_end: Date;
    @CreateDateColumn()
    cerate_at:Date
    @UpdateDateColumn()
    update_at:Date
    @OneToMany(type=>FilesNews,flie=> flie.news,{ eager: true,cascade: ['insert', 'update'] })
    @JoinColumn({ name: 'newsId ' })
    files:FilesNews[]
}
