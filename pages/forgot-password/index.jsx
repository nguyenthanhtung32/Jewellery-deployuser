import { memo, useState } from "react";
import { Form, Input, Button } from "antd";
import axiosClient from "@/libraries/axiosClient";
import Link from "next/link";
import { MailSearch } from "lucide-react";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    try {
      await axiosClient.post("/customers/forgot-password", {
        email,
      });
      toast.success("Hãy xác nhận Email", 1);
    } catch (error) {
      console.error(error);
      toast.error("Email không tồn tại", 1);
    }
  };

  return (
    <div className="py-9 flex items-center justify-center">
      <Form className="p-4 sm:p-8 shadow-2xl w-full sm:w-7/12 ">
        <h2 className="mt-2 font-bold text-3xl text-center">Quên mật khẩu</h2>
        <h4 className="mt-1 text-gray mx-12 mt-4">
          Chúng tôi sẽ gửi yêu cầu đổi mật khẩu về email của bạn
        </h4>

        <Form.Item
          name="email"
          className="mx-12 pt-2"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ email!",
            },
            {
              type: "email",
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            prefix={<MailSearch className="mr-2 text-lg text-primry" />}
            placeholder="Vui lòng nhập email của bạn"
          />
        </Form.Item>

        <Form.Item className="text-center mx-12">
          <Button
            type="submit"
            htmlType="submit"
            onClick={handleSendEmail}
            className="w-full bg-primry text-white p-2 h-12 "
          >
            Gửi yêu cầu
          </Button>
        </Form.Item>
        <div className="flex mx-12">
          <h4>Bạn chưa có tài khoản ?</h4>
          <Link className="ml-2" href="/sign-up">
            Đăng ký
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default memo(ForgotPassword);
