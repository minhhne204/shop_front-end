const Comment = () => {
  return <div className="comment-section">Comment Section</div>;
};
const [comments, setComments] = useState([]);
import React, { useEffect, useState } from "react";

if (!user) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-[#F5F5F3] rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-[#9A9A9A]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h1 className="text-[24px] font-semibold text-[#2D2D2D] mb-3">
        Bạn chưa đăng nhập
      </h1>
      <p className="text-[15px] text-[#6B6B6B] mb-8">
        Vui lòng đăng nhập để xem và quản lý bình luận.
      </p>
      <Link
        to="/dang-nhap"
        className="inline-block bg-[#2D2D2D] text-white px-8 py-3.5 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors"
      >
        Đăng nhập
      </Link>
    </div>
  );
}
useEffect(() => {
  const loadComments = async () => {
    const data = await fetchComments();
    setComments(data);
  };
  loadComments();
}, []);

if (loading) return <Loading />;

<div className="flex items-baseline gap-4 mb-6">
            {getCurrentPrice() < getOriginalPrice() ? (
              <>
                <span className="text-[28px] font-semibold text-[#C45C4A]">
                  {formatPrice(getCurrentPrice())}
                </span>
                <span className="text-[18px] text-[#9A9A9A] line-through">
                  {formatPrice(getOriginalPrice())}
                </span>
                <span className="bg-[#C45C4A] text-white text-[12px] font-medium px-2.5 py-1 rounded-full">
                  -
                  {Math.round(
                    (1 - getCurrentPrice() / getOriginalPrice()) * 100
                  )}
                  %
                </span>
              </>
            ) : (
              <span className="text-[28px] font-semibold text-[#2D2D2D]">
                {formatPrice(getCurrentPrice())}
              </span>
            )}
          </div>
          


export default Comment;
