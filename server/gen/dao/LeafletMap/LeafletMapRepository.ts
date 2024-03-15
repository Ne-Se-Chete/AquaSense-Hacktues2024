import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeafletMapEntity {
    readonly Id: number;
}

export interface LeafletMapCreateEntity {
}

export interface LeafletMapUpdateEntity extends LeafletMapCreateEntity {
    readonly Id: number;
}

export interface LeafletMapEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
        };
        contains?: {
            Id?: number;
        };
        greaterThan?: {
            Id?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
        };
        lessThan?: {
            Id?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
        };
    },
    $select?: (keyof LeafletMapEntity)[],
    $sort?: string | (keyof LeafletMapEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeafletMapEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeafletMapEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class LeafletMapRepository {

    private static readonly DEFINITION = {
        table: "LEAFLETMAP",
        properties: [
            {
                name: "Id",
                column: "LEAFLETMAP_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(LeafletMapRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeafletMapEntityOptions): LeafletMapEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeafletMapEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeafletMapCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "LEAFLETMAP",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAFLETMAP_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeafletMapUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "LEAFLETMAP",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAFLETMAP_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeafletMapCreateEntity | LeafletMapUpdateEntity): number {
        const id = (entity as LeafletMapUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeafletMapUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "LEAFLETMAP",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAFLETMAP_ID",
                value: id
            }
        });
    }

    public count(options?: LeafletMapEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "LEAFLETMAP"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeafletMapEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("server-LeafletMap-LeafletMap", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("server-LeafletMap-LeafletMap").send(JSON.stringify(data));
    }
}
