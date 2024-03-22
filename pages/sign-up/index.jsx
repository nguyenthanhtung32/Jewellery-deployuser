import React, { memo, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Space,
  Select,
  message,
  BackTop,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "../../libraries/axiosClient";
const apiName = "customers";

const SignUp = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [createForm] = Form.useForm();
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, []);

  const fetchProvinces = () => {
    fetch("https://vapi.vnappmob.com/api/province/")
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const fetchDistricts = (provinceId) => {
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        setDistricts(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const fetchWards = (districtId) => {
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {
        setWards(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleProvinceChange = (value) => {
    fetchDistricts(value);
    setWards([]);
  };

  const handleDistrictChange = (value) => {
    fetchWards(value);
  };

  const onFinish = (values) => {
    const { provinceId, districtId, wardId, address } = values;

    const provinceName = provinces.find(
      (province) => province.province_id === provinceId
    )?.province_name;
    const districtName = districts.find(
      (district) => district.district_id === districtId
    )?.district_name;
    const wardName = wards.find((ward) => ward.ward_id === wardId)?.ward_name;

    if (provinceName && districtName && wardName) {
      const fullAddress = `${address}, ${wardName}, ${districtName}, ${provinceName}  `;

      const dataToSend = { ...values, address: fullAddress };

      axios
        .post(apiName, dataToSend)
        .then((_response) => {
          setRefresh((f) => f + 1);
          createForm.resetFields();
          router.push("/sign-in");
          message.success("Đăng ký thành công!");
        })
        .catch((err) => {
          console.error(err);
          message.error("Đăng ký thất bại");
        });
    } else {
      message.error("Đã xảy ra lỗi khi tạo địa chỉ hoàn chỉnh.");
    }
    [refresh];
  };

  return (
    <div className="py-9 flex items-center justify-center">
      <Form
        form={createForm}
        name="create-form"
        onFinish={onFinish}
        className="p-4 sm:p-8 shadow-2xl w-full sm:w-6/12"
      >
        <h2 className="mt-2 font-bold text-3xl text-center">
          Đăng ký tài khoản
        </h2>
        <h4 className="mt-1 text-gray text-center">
          Nhập thông tin để tạo tài khoản mới
        </h4>

        <Form.Item
          name="firstName"
          className="pt-2 mx-12"
          rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
        >
          <Input
            prefix={<UserOutlined className="mr-2 text-lg text-primry" />}
            placeholder="Tên"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          className="mx-12"
          rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
        >
          <Input
            prefix={<UserOutlined className="mr-2 text-lg text-primry" />}
            placeholder="Họ"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          className="mx-12"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="mr-2 text-lg text-primry" />}
            placeholder="Email"
            size="large"
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
            prefix={<LockOutlined className="mr-2 text-lg text-primry" />}
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
            prefix={<LockOutlined className="mr-2 text-lg text-primry" />}
            placeholder="Nhập lại mật khẩu"
            size="large"
          />
        </Form.Item>

        <div className="mx-12 xl:space-x-3 lg:block xl:flex">
          <Form.Item
            name="provinceId"
            className="xl:w-[221px] lg:w-full"
            rules={[
              { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
            ]}
          >
            <Select
              placeholder="Chọn Tỉnh/Thành phố"
              onChange={handleProvinceChange}
              size="large"
              options={
                provinces.length > 0 &&
                provinces.map((province) => {
                  return {
                    value: province.province_id,
                    label: province.province_name,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item
            name="districtId"
            className="xl:w-[221px] lg:w-full"
            rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
          >
            <Select
              placeholder="Chọn Quận/Huyện"
              onChange={handleDistrictChange}
              size="large"
              options={
                districts.length > 0 &&
                districts.map((district) => {
                  return {
                    value: district.district_id,
                    label: district.district_name,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item
            name="wardId"
            className="xl:w-[221px] lg:w-full"
            rules={[{ required: true, message: "Vui lòng chọn Phường/Xã" }]}
          >
            <Select
              placeholder="Chọn Phường/Xã"
              size="large"
              options={
                wards.length > 0 &&
                wards.map((ward) => {
                  return {
                    value: ward.ward_id,
                    label: ward.ward_name,
                  };
                })
              }
            />
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          className="mx-12"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input size="large" placeholder="Nhập địa chỉ cụ thể" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          className="mx-12"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input
            prefix={<PhoneOutlined className="mr-2 text-lg text-primry" />}
            placeholder="Số điện thoại"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          className="mx-12 border border-gray rounded-lg h-auto py-1 flex items-center"
        >
          <Space>
            <TeamOutlined className="ml-3 mr-3 text-lg text-primry" />
            <Radio.Group>
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
              <Radio value="LGBT">LGBT</Radio>
            </Radio.Group>
          </Space>
        </Form.Item>

        <Form.Item
          name="birthday"
          className="mx-12"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker
            placeholder="Ngày sinh"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="submit" className="mx-12">
          <Button
            type="primry"
            htmlType="submit"
            className="w-full bg-primry text-white p-2 h-12"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <BackTop/>
    </div>
  );
};

export default memo(SignUp);
