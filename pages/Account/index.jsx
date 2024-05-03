import React, { memo, useState, useEffect } from "react";
import axios from "../../libraries/axiosClient";
import { API_URL } from "@/constants";
import Moment from "moment";
import { useRouter } from "next/router";
import {
  Input,
  Form,
  Select,
  Space,
  Modal,
  Radio,
  DatePicker,
  Upload,
  BackTop,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import ImgCrop from "antd-img-crop";
import { Info } from "lucide-react";
import { toast } from "react-toastify";

const apiName = "/customers";

function Account() {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [open, setOpen] = useState(false);
  const [updateForm] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchProvinces();
    fetchDistricts();
    fetchWards();
    fetchCustomers();
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

  const onFinishUpdate = (values) => {
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
        .patch(apiName + "/" + updateId, dataToSend)
        .then((_response) => {
          setRefresh((f) => f + 1);
          updateForm.resetFields();
          setOpen(false);
          toast.success("Cập nhật thành công!");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Cập nhật thất bại");
        });
    } else {
      toast.error("Cập nhật thất bại.");
    }
    [refresh];
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      const response = await axios.get(`/customers/${customerId}`);
      const data = response.data;

      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLogin(true);
    }
  }, [router]);

  const HanleChangePass = () => {
    router.push("/change-password");
  }

  return (
    <>
      {isLogin ? (
        <div>
          {customers && (
            <>
              <div className="text-gray-800 py-4 px-4 sm:px-6 lg:px-8 font-roboto">
                <div className="max-w-4xl mx-auto">
                  <p className="text-center py-6 text-3xl">TÀI KHOẢN CỦA BẠN</p>
                  <div className="flex mt-6">
                    <div className="space-y-8 w-1/3">
                      <div>
                        <label className="block text-lg border-b pb-2 text-slate-500">
                          Email
                        </label>
                        <p className="mt-2 text-lg border-gray">
                          {customers.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-lg border-b pb-2 text-slate-500">
                          Ngày sinh
                        </label>
                        <p className="mt-2 text-lg border-gray">
                          {Moment(customers.birthday).format("DD/MM/YYYY")}
                        </p>
                      </div>

                      <div>
                        <label className="block text-lg border-b pb-2 text-slate-500">
                          Địa chỉ
                        </label>
                        <p className="mt-2 text-lg border-gray">
                          {customers.address}
                        </p>
                      </div>
                    </div>

                    <div className="w-1/3 mx-3 text-right">
                      <ImgCrop rotationSlider>
                        <Upload
                          showUploadList={false}
                          name="file"
                          action={`${API_URL}/customerAvatar/customers/${customers._id}/avatar`}
                          headers={{ authorization: "authorization-text" }}
                          onChange={(info) => {
                            if (info.file.status === "done") {
                              router.reload();
                              toast.success(
                                "Cập nhật ảnh đại diện thành công!"
                              );
                            } else if (info.file.status === "error") {
                              toast.error("Cập nhật ảnh đại diện thất bại.");
                            }
                          }}
                        >
                          <div className="relative">
                            <img
                              src={`${API_URL}/${customers.avatarUrl}`}
                              alt={`Avatar-${customers._id}`}
                              className="w-[300px] object-cover rounded-full h-[300px]"
                            />
                            <div className="absolute cursor-pointer rounded-full inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray text-5xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <CameraOutlined />
                            </div>
                          </div>
                        </Upload>
                      </ImgCrop>
                    </div>

                    <div className="w-1/3 text-right space-y-8">
                      <div>
                        <label className="block text-lg border-b pb-2 text-slate-500">
                          Tên
                        </label>
                        <p className="mt-2 text-lg border-gray ">
                          {customers.lastName} {customers.firstName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-lg border-b pb-2 text-slate-500">
                          Giới tính
                        </label>
                        <p className="mt-2 text-lg border-gray">
                          {customers.gender}
                        </p>
                      </div>
                      <div>
                        <label className="block text-lg border-b pb-2 text-slate-500">
                          Số điện thoại
                        </label>
                        <p className="mt-2 text-lg border-gray">
                          {customers.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-6 flex gap-4 items-center justify-center">
                    <button
                      onClick={() => {
                        setOpen(true);
                        setUpdateId(customers._id);
                      }}
                      className="mt-8 mb-8 bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-white border border-black hover:text-black transition-colors duration-300 w-[250px]"
                    >
                      Chỉnh sửa thông tin cá nhân
                    </button>
                    <button onClick={HanleChangePass} className="mt-8 mb-8 bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-white border border-black hover:text-black transition-colors duration-300 w-[250px]">
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>
              </div>

              <Modal
                title="Cập nhật thông tin cá nhân"
                open={open}
                onCancel={() => {
                  setOpen(false);
                }}
                cancelText="Đóng"
                okText="Cập nhật"
                onOk={() => {
                  updateForm.submit();
                }}
              >
                <Form
                  form={updateForm}
                  name="update-form"
                  onFinish={onFinishUpdate}
                >
                  <Form.Item
                    name="firstName"
                    className="pt-2 mx-12"
                    rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
                  >
                    <Input
                      prefix={
                        <UserOutlined className="mr-2 text-lg text-primry" />
                      }
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
                      prefix={
                        <UserOutlined className="mr-2 text-lg text-primry" />
                      }
                      placeholder="Họ"
                      size="large"
                    />
                  </Form.Item>

                  <div className="mx-12 block">
                    <Form.Item
                      name="provinceId"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn Tỉnh/Thành phố",
                        },
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
                      rules={[
                        { required: true, message: "Vui lòng chọn Quận/Huyện" },
                      ]}
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
                      rules={[
                        { required: true, message: "Vui lòng chọn Phường/Xã" },
                      ]}
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
                    className="mx-12"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa chỉ cụ thể",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <EnvironmentOutlined className="mr-2 text-lg text-primry" />
                      }
                      size="large"
                      placeholder="Nhập địa chỉ cụ thể"
                    />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    className="mx-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <PhoneOutlined className="mr-2 text-lg text-primry" />
                      }
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
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                    ]}
                  >
                    <DatePicker
                      placeholder="Ngày sinh"
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
        </div>
      ) : (
        <div className="my-20 mx-60  flex justify-center font-bold">
          <Info />
          <p className="ml-3">Không có thông tin dữ liệu</p>
        </div>
      )}
      <BackTop />
    </>
  );
}

export default memo(Account);
