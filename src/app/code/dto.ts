export class ServiceResponse<T> {

    public IsSuccess: boolean;

    public ResultType: ResultType;

    public Message: string;

    public TotalCount: number;

    public Data: T;
}

export enum ResultType {

    Information = 1,

    Validation = 2,

    Success = 3,

    Warning = 4,

    Error = 5,
}

export class BaseDto {

    public Id: number;

    public CreateDate: Date;

    public CreatedBy: number;

    public UpdateDate: Date;

    public UpdatedBy: number;

    public IsActive: boolean;
}

export class PagingDto {

    constructor() {
        this.pageNumber = 1;
        this.pageSize = 10; // TODO: Get from config.service
        this.orderBy = 'Id';
        this.order = 'desc';
        this.count = 0;
    }


    public pageNumber: number;

    public pageSize: number;

    public orderBy: string;

    public order: string;

    public count: number;
}

