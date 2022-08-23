export class Response {
    statusCode: number;
    message: string;
    data?: any;
}
enum resCode {
    success = 200,
    fail = 404
}