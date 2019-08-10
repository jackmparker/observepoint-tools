export interface IToolsModel {
    path: string;
    name: string;
    description: string;
    title?: string;
}

export interface IProfileModel {
    name: string;
    key: string;
}

export interface ITagModel {
    name: string;
    numVariables: number;
    icon: string;
    numSignatures: number;
    id: number;
    category: ITagCategoryModel;
    duplicateScoring: boolean;
}

export interface ITagSimpleModel {
    name: string;
    icon: string;
    id: number;
    category: string;
}

export interface ITagCategoryModel {
    id: number;
    name: string;
}

export interface ILoginResponseModel {
    accessToken: string;
    created: string;
    credentialsExpired: boolean;
    userId: number;
}

export interface IErrorResponseModel {
    error: IErrorSubModel;
    headers: IErrorHeadersModel;
    message: string;
    name: string;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
}

export interface IErrorSubModel {
    details: string;
    message: string;
    timestamp: string;
}

export interface IErrorHeadersModel {
    lazyInit: any;
    lazyUpdate: any;
    normalizedNames?: any;
}

export interface IFolderDomainIdModel {
    name: string;
    id: number;
}