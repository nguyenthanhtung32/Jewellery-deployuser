import React, { memo, useState } from "react";
import { Form, Input, Button, message, BackTop } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "../../libraries/axiosClient";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = {
      email,
      password,
    };

    try {
      const response = await axios.post("/customers/login", account);
      const { token } = response.data;

      const customer = await axios.get("/customers/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (customer.data.status === true) {
        message.error("Tài khoản của bạn đã bị khóa.");
      } else {
        localStorage.setItem("token", token);

        axios.defaults.headers.Authorization = `Bearer ${token}`;

        message.success("Đăng nhập thành công!!!");

        router.push("/");
      }
    } catch (error) {
      console.error(error);
      message.error("Đăng nhập thất bại.");
    }
  };

  return (
    <div className="py-9 flex items-center justify-center">
      <Form className="p-4 sm:p-8 shadow-2xl w-full sm:w-7/12 ">
        <h2 className="mt-2 font-bold text-3xl text-center">
          Chào mừng trở lại
        </h2>
        <h4 className="mt-1 text-gray text-center">
          Nhập thông tin đăng nhập để có thể truy cập tài khoản
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
            onChange={handleEmailChange}
            className="h-12"
            prefix={<MailOutlined className="mr-2 text-lg text-primry " />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
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
            className="h-12"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            prefix={<LockOutlined className="mr-2 text-lg text-primry" />}
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Form.Item className="text-center mx-12">
          <Button
            type="submit"
            htmlType="submit"
            onClick={handleSubmit}
            className="w-full bg-primry text-white p-2 h-12 "
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="flex mx-6 text-sm">
          <Link href="/forgot-password" className="login-form-forgot">
            Quên mật khẩu?
          </Link>
          <h4 className="ml-auto">Bạn chưa có tài khoản?</h4>
          <Link className="text-primry ml-2" href="/sign-up">
            Đăng ký
          </Link>
        </div>
      </Form>
      <BackTop/>
    </div>
  );
};

export default memo(SignIn);
