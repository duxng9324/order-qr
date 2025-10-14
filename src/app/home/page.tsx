import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200" data-theme="light">
      <h2 className="text-2xl font-bold text-primary mb-4">Kiểm tra Tailwind & DaisyUI</h2>
      <button className="btn btn-success">Nút thành công</button>
      <p className="mt-4 text-base-content">Nếu nút có màu xanh lá và nền màu hồng nhạt, cấu hình đã OK!</p>
    </div>
  );
};

export default Home;