import { Entity, Unique, Column, PrimaryColumn } from "typeorm";

@Entity('user')
@Unique(['email'])
export class User{
    @PrimaryColumn({type:"uuid"})
    id:string

    @Column()
    username:string

    @Column()
    email:string

    @Column()
    password:string
    
    // async validatePassword(password: string): Promise<boolean> {
    //     return await bcrypt.compare(password, this.password);
    // }
}


