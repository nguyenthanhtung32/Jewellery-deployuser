import { memo, useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "@/libraries/axiosClient";
import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { LockKeyhole } from "lucide-react";

function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      await axiosClient.patch(`/customers/reset-password/${token}`, {
        password,
      });
      toast.success("Đặt lại mật khẩu thành công", 1);
      router.push("/sign-in");
    } catch (error) {
      toast.error("Đặt lại mật khẩu thất bại", 1);
    }
  };

  return (
    <div className="py-9 flex items-center justify-center">
      <Form className="p-4 sm:p-8 shadow-2xl w-full sm:w-7/12">
        <h2 className="mt-2 font-bold text-3xl text-center">
          Đặt lại mật khẩu
        </h2>

        <Form.Item
          name="password"
          className="mx-12 mt-10"
          onChange={(e) => setPassword(e.target.value)}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            {
              min: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự",
            },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
              message:
                "Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt",
            },
          ]}
        >
          <Input.Password
            prefix={<LockKeyhole className="mr-2 text-lg text-primry" />}
            placeholder="Mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          className="mx-12"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu xác nhận không khớp");
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockKeyhole className="mr-2 text-lg text-primry" />}
            placeholder="Nhập lại mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item className="text-center mx-12">
          <Button
            type="submit"
            htmlType="submit"
            onClick={handleResetPassword}
            className="w-full bg-primry text-white p-2 h-12 "
          >
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(ResetPasswordPage);
