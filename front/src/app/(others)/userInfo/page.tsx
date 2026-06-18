"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore, useAppStoreActions } from "@/hooks/store/app-store";
import { ArrowLeft, User, Lock } from "lucide-react";

export default function UserInfoPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const { logout } = useAppStoreActions();

  const handleBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center overflow-hidden">
      {/* 用户卡片 - 移动端全屏，PC端固定宽度 */}
      <div className="h-full w-full sm:w-[420px] sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-2xl overflow-hidden sm:shadow-lg relative flex flex-col">
        {/* 顶部封面Header区域 */}
        <div
          className="relative h-[220px] sm:h-[220px] bg-cover bg-center flex-shrink-0"
          style={{
            backgroundImage: "url('http://47.108.73.254/images/3b8203f4-b058-43be-8314-5449ed4f7cb0.jpg')",
          }}
        >
          {/* 左上角返回按钮 */}
          <button
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* 右上角登出按钮 */}
          <button
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-sm hover:bg-white/40 transition-colors"
            onClick={handleLogout}
          >
            登出
          </button>

          {/* 头像：水平绝对居中，向下偏移一半自身高度，精准居中于封面底部 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-55px]">
            <div className="w-[110px] h-[110px] rounded-full border-[5px] border-white overflow-hidden shadow-md bg-gray-100">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="头像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="w-12 h-12 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 卡片内容区，预留头像空间 - 移动端使用flex-1填满剩余空间，PC端正常高度 */}
        <div className="flex-1 pt-[70px] pb-8 px-6 flex flex-col overflow-hidden">
          {/* 昵称标题 */}
          <div className="text-center mb-8 flex-shrink-0">
            <h2 className="text-[32px] font-bold text-gray-800">
              {user?.nickname || "用户"}
            </h2>
            <p className="text-xl text-gray-400 mt-1">个人主页</p>
          </div>

          {/* 信息列表 */}
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {/* 昵称行 */}
            <div className="flex justify-between items-center py-4 border-b border-gray-100">
              <span className="text-gray-600 text-lg flex items-center gap-2">
                <User className="w-6 h-6" />
                昵称
              </span>
              <span className="text-gray-800 text-lg">
                {user?.nickname || "未设置"}
              </span>
            </div>

            {/* 密码状态行 */}
            <div className="flex justify-between items-center py-4 border-b border-gray-100">
              <span className="text-gray-600 text-lg flex items-center gap-2">
                <Lock className="w-6 h-6" />
                登录密码
              </span>
              <span className="px-4 py-1.5 rounded-md text-base bg-green-50 text-green-500">
                已设置
              </span>
            </div>
          </div>

          {/* 底部双按钮 */}
          <div className="mt-auto pt-8 flex gap-4 flex-shrink-0">
            <Button className="flex-1 py-4 h-auto text-xl bg-sky-500 hover:bg-sky-600">
              编辑资料
            </Button>
            <Button
              variant="secondary"
              className="flex-1 py-4 h-auto text-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              修改密码
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
