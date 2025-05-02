export type FileObj = { uuid: string; file: File; uploading: boolean; url: string | null };

export type PromiseValue<T> = T extends Promise<infer U> ? U : T;
