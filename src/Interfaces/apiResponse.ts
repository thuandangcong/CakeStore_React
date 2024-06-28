export default interface apiResponse {
    data?: {
      statusCode?: number;
      isSuccess?: boolean;
      errorMessages?: Array<string>;
      result: {
        // tự định nghĩa kiểu trả về của result
        [key: string]: string;
      };
    };
    error?: any;
  }