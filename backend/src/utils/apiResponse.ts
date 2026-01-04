class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  constructor(status: number, success: boolean, message: string, data: T) {
    this.success = status < 400;
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
// success,message,data,status

export { ApiResponse };
