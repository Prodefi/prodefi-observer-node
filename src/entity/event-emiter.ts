import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("event_emiters")
export class EventEmitter {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: number;

    @Column()
    tx_index: number;

    @Column()
    tx_hash: string;

    @Column()
    block_hash: string;

    @Column()
    block_number: string;

    @Column()
    from_address: string;

    @Column()
    to_address: string;

    @Column()
    contract_address: string;

    @Column()
    amount: string;

    @Column()
    signature: string;

    @Column()
    idx: string;

    @Column()
    id_log: string;

    @CreateDateColumn({
        type: "timestamp with time zone"
    })
    created_at: Date;

    @UpdateDateColumn({
        nullable: true,
        type: "timestamp with time zone"
    })
    updated_at: Date;

}
