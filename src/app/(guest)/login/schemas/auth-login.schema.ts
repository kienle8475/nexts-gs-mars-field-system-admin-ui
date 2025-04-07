import { z } from "zod";

const authLoginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đăng nhập!" })
    .min(3, { message: "Tên đăng nhập tối thiểu 3 kí tự!" })
    .max(20, { message: "Tên đăng nhập tối đa 20 kí tự!" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống!" }),
});

type AuthLoginSchema = z.infer<typeof authLoginSchema>;

export { authLoginSchema };
export type { AuthLoginSchema };
