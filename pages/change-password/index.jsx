import axiosClient from "@/libraries/axiosClient";
import { Button, Form, Input } from "antd";
import { LockKeyhole, MailIcon } from "lucide-react";
import { useRouter } from "next/router";
import { memo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function ChangePassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const customerId = decoded._id;

        const response = await axiosClient.get(`/customers/${customerId}`);
        const customerData = response.data;

        setEmail(customerData.email);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomerData();
  }, []);

  const handleChangePassword = async () => {
    try {
      await axiosClient.post(`/customers/change-password`, {
        email: email,
        oldPassword: password,
        newPassword: confirmPassword,
      });

      toast.success("Mật khẩu đã được thay đổi thành công", 1);
      router.push("/");
    } catch (err) {
      toast.error(err.response.data.message, 1);
    }
  };

  return (
    <div className="py-9 flex items-center justify-center">
      <Form
        className="p-4 sm:p-8 shadow-2xl w-full sm:w-7/12"
        onFinish={handleChangePassword}
      >
        <h2 className="mt-2 font-bold text-3xl text-center">Đổi mật khẩu</h2>
        <Form.Item className="mx-12 pt-2">
          <Input
            type="email"
            id="email"
            value={email}
            readOnly
            prefix={<MailIcon className="mr-2 text-lg text-primry " />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="oldPassword"
          className="mx-12"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
          ]}
        >
          <Input.Password
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockKeyhole className="mr-2 text-lg text-primry" />}
            placeholder="Nhập mật khẩu hiện tại"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          className="mx-12"
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
            onChange={(e) => setConfirmPassword(e.target.value)}
            prefix={<LockKeyhole className="mr-2 text-lg text-primry" />}
            placeholder="Nhập mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          className="mx-12"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu xác nhận không khớp");
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockKeyhole className="mr-2 text-lg text-primry" />}
            placeholder="Nhập lại mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item className="text-center mx-12">
          <Button
            type="submit"
            htmlType="submit"
            className="w-full bg-primry text-white p-2 h-12 "
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(ChangePassword);
