export enum MessageEnum {
    PORT = 'Server is listening on port',
    USER_NOT_FOUND = 'The user with corresponding uuid is not found',
    INVALID_UUID = 'Invalid uuid',
    REQUIRED_FIELDS = 'Not all of the required fields has been provided'
};

export enum EventEnum {
    ERROR = 'error',
    DATA = 'data',
    END = 'end'
};

export enum MethodEnum {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum StatusCodeEnum {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}

export enum HeaderEnum {
    CONTENT_TYPE = 'Content-Type'
};

export enum ContentTypeEnum {
    APP_JSON = 'application/json'
};