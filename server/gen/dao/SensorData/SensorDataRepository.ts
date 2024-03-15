import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface SensorDataEntity {
    readonly Id: number;
    Latitude?: number;
    Longitude?: number;
    ph?: number;
    typeTrash?: string;
    IsThereOil?: boolean;
    DateTime?: Date;
}

export interface SensorDataCreateEntity {
    readonly Latitude?: number;
    readonly Longitude?: number;
    readonly ph?: number;
    readonly typeTrash?: string;
    readonly IsThereOil?: boolean;
    readonly DateTime?: Date;
}

export interface SensorDataUpdateEntity extends SensorDataCreateEntity {
    readonly Id: number;
}

export interface SensorDataEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Latitude?: number | number[];
            Longitude?: number | number[];
            ph?: number | number[];
            typeTrash?: string | string[];
            IsThereOil?: boolean | boolean[];
            DateTime?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Latitude?: number | number[];
            Longitude?: number | number[];
            ph?: number | number[];
            typeTrash?: string | string[];
            IsThereOil?: boolean | boolean[];
            DateTime?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Latitude?: number;
            Longitude?: number;
            ph?: number;
            typeTrash?: string;
            IsThereOil?: boolean;
            DateTime?: Date;
        };
        greaterThan?: {
            Id?: number;
            Latitude?: number;
            Longitude?: number;
            ph?: number;
            typeTrash?: string;
            IsThereOil?: boolean;
            DateTime?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Latitude?: number;
            Longitude?: number;
            ph?: number;
            typeTrash?: string;
            IsThereOil?: boolean;
            DateTime?: Date;
        };
        lessThan?: {
            Id?: number;
            Latitude?: number;
            Longitude?: number;
            ph?: number;
            typeTrash?: string;
            IsThereOil?: boolean;
            DateTime?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Latitude?: number;
            Longitude?: number;
            ph?: number;
            typeTrash?: string;
            IsThereOil?: boolean;
            DateTime?: Date;
        };
    },
    $select?: (keyof SensorDataEntity)[],
    $sort?: string | (keyof SensorDataEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SensorDataEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SensorDataEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SensorDataRepository {

    private static readonly DEFINITION = {
        table: "SENSORDATA",
        properties: [
            {
                name: "Id",
                column: "SENSORDATA_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Latitude",
                column: "SENSORDATA_TESTER",
                type: "DOUBLE",
            },
            {
                name: "Longitude",
                column: "SENSORDATA_PROPERTY3",
                type: "DOUBLE",
            },
            {
                name: "ph",
                column: "SENSORDATA_PROPERTY4",
                type: "DOUBLE",
            },
            {
                name: "typeTrash",
                column: "SENSORDATA_TYPETRASH",
                type: "VARCHAR",
            },
            {
                name: "IsThereOil",
                column: "SENSORDATA_ISTHEREOIL",
                type: "BOOLEAN",
            },
            {
                name: "DateTime",
                column: "SENSORDATA_DATETIME",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SensorDataRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SensorDataEntityOptions): SensorDataEntity[] {
        return this.dao.list(options).map((e: SensorDataEntity) => {
            EntityUtils.setBoolean(e, "IsThereOil");
            return e;
        });
    }

    public findById(id: number): SensorDataEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setBoolean(entity, "IsThereOil");
        return entity ?? undefined;
    }

    public create(entity: SensorDataCreateEntity): number {
        EntityUtils.setBoolean(entity, "IsThereOil");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "SENSORDATA",
            entity: entity,
            key: {
                name: "Id",
                column: "SENSORDATA_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SensorDataUpdateEntity): void {
        EntityUtils.setBoolean(entity, "IsThereOil");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "SENSORDATA",
            entity: entity,
            key: {
                name: "Id",
                column: "SENSORDATA_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SensorDataCreateEntity | SensorDataUpdateEntity): number {
        const id = (entity as SensorDataUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SensorDataUpdateEntity);
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
            table: "SENSORDATA",
            entity: entity,
            key: {
                name: "Id",
                column: "SENSORDATA_ID",
                value: id
            }
        });
    }

    public count(options?: SensorDataEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "SENSORDATA"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SensorDataEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("server-SensorData-SensorData", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("server/SensorData/SensorData").send(JSON.stringify(data));
    }
}