export default function Account() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Thông tin tài khoản</h2>
        <p><strong>Tên:</strong> Nguyễn Văn A</p>
        <p><strong>Email:</strong> nguyenvana@example.com</p>
        <button className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
